// NomiFun's cursor-revealed dot grid uses consistent spacing, radius and easing,
// scoped to this canvas with complete teardown and visibility-aware rendering.
import * as THREE from "three";

export function initDotField(canvas) {
  if (!canvas?.parentElement) return () => {};
  const host = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1000);
  camera.position.z = 10;
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uDotColor: { value: new THREE.Color(0x596375) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uRadius: { value: 240 },
      uStrength: { value: 0 },
    },
    vertexShader: `
      uniform vec2 uMouse;
      uniform float uRadius;
      uniform float uStrength;
      varying float vAlpha;
      void main() {
        vec2 instancePos = vec2(instanceMatrix[3][0], instanceMatrix[3][1]);
        float factor = clamp(1.0 - distance(instancePos, uMouse) / uRadius, 0.0, 1.0);
        vAlpha = pow(factor, 1.4) * uStrength;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uDotColor;
      varying float vAlpha;
      void main() {
        if (vAlpha <= 0.01) discard;
        gl_FragColor = vec4(uDotColor, vAlpha * 0.85);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  let width = 0;
  let height = 0;
  let mesh;
  let frame = 0;
  let visible = false;
  let disposed = false;
  let inside = false;
  let strength = 0;
  const target = { x: -9999, y: -9999 };
  const smooth = { x: -9999, y: -9999 };
  const dummy = new THREE.Object3D();

  const resize = () => {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (mesh) {
      scene.remove(mesh);
      mesh.dispose();
    }
    const columns = Math.ceil(width / 16) + 2;
    const rows = Math.ceil(height / 16) + 2;
    mesh = new THREE.InstancedMesh(geometry, material, columns * rows);
    for (let i = 0; i < mesh.count; i++) {
      dummy.position.set(
        (i % columns) * 16 - width / 2,
        height / 2 - Math.floor(i / columns) * 16,
        0,
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
    requestRender();
  };

  function render() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    strength += ((inside ? 1 : 0) - strength) * (inside ? 0.15 : 0.08);
    if (inside) {
      if (smooth.x === -9999) {
        smooth.x = target.x;
        smooth.y = target.y;
      } else {
        smooth.x += (target.x - smooth.x) * 0.12;
        smooth.y += (target.y - smooth.y) * 0.12;
      }
    } else if (strength < 0.005) {
      smooth.x = smooth.y = -9999;
      strength = 0;
    }
    material.uniforms.uMouse.value.set(smooth.x, smooth.y);
    material.uniforms.uStrength.value = strength;
    renderer.render(scene, camera);
    if (inside || strength > 0.005) requestRender();
  }

  function requestRender() {
    if (!disposed && !frame && visible && !document.hidden)
      frame = requestAnimationFrame(render);
  }
  const move = (event) => {
    if (event.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    target.x = event.clientX - rect.left - width / 2;
    target.y = height / 2 - (event.clientY - rect.top);
    requestRender();
  };
  const leave = () => {
    inside = false;
    requestRender();
  };
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestRender();
  };
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestRender();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      inside = false;
    }
  });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  intersection.observe(host);
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("mouseleave", leave);
  document.addEventListener("visibilitychange", visibility);
  resize();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    intersection.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", move);
    document.removeEventListener("mouseleave", leave);
    document.removeEventListener("visibilitychange", visibility);
    mesh?.dispose();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
