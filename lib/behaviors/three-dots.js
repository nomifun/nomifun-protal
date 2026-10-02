import * as THREE from "three";

// NomiFun's animated light-film provides a decorative hero background.
// This is decorative artwork; it does not depict a running product session.
export function initThreeDots(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader: `
    precision highp float; varying vec2 vUv; uniform float uTime; uniform vec2 uResolution; uniform vec2 uMouse;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
    void main(){
      vec2 uv=vUv;float aspect=uResolution.x/uResolution.y;vec2 p=vec2((uv.x-.5)*aspect,uv.y-.5);float t=uTime*.08;
      float n=noise(p*2.+vec2(t,-t*.25));float n2=noise(p*4.+vec2(-t*.4,t*.2));
      vec3 base=vec3(.967,.961,.942);vec3 lilac=vec3(.67,.58,.89),coral=vec3(.98,.73,.57),mint=vec3(.62,.82,.79);
      float glow1=exp(-length(p-vec2(-.55+.13*sin(t),-.23))*.85),glow2=exp(-length(p-vec2(.6+.1*cos(t),.2))*.85);
      base=mix(base,lilac,glow1*.22);base=mix(base,coral,glow2*.19);base=mix(base,mint,exp(-length(p-vec2(.2,-.55))*1.4)*.16);
      float band=sin((p.y+.25*sin(p.x*1.3+t)+n*.16)*8.+t*1.5);float silk=pow(abs(band),18.);
      float edge=1.-smoothstep(.05,.75,abs(p.y+.18));
      base=mix(base,vec3(.98,.96,1.),silk*.25*edge);
      float lines=pow(.5+.5*sin((p.x+p.y*.5+n2*.03)*90.),24.)*.025;
      base+=lines;float grain=(hash(gl_FragCoord.xy+floor(uTime*2.))-.5)*.016;base+=grain;
      float pointer=exp(-length((uv-uMouse)*vec2(aspect,1.))*4.);base=mix(base,vec3(1.,.88,.83),pointer*.08);
      gl_FragColor=vec4(base,1.);
    }`,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  scene.add(new THREE.Mesh(geometry, material));
  let raf,
    alive = true,
    visible = true,
    lastTime = 0,
    target = { x: 0.5, y: 0.5 };
  const resize = () => {
    const p = canvas.parentElement,
      w = p.clientWidth,
      h = p.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(w, h);
  };
  const pointer = (e) => {
    const r = canvas.getBoundingClientRect();
    target.x = (e.clientX - r.left) / r.width;
    target.y = 1 - (e.clientY - r.top) / r.height;
  };
  const loop = (time) => {
    if (!alive) return;
    if (visible && !document.hidden && time - lastTime > 28) {
      uniforms.uTime.value = time / 1000;
      uniforms.uMouse.value.lerp(new THREE.Vector2(target.x, target.y), 0.12);
      renderer.render(scene, camera);
      lastTime = time;
    }
    raf = requestAnimationFrame(loop);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);
  canvas.parentElement.addEventListener("pointermove", pointer, {
    passive: true,
  });
  resize();
  raf = requestAnimationFrame(loop);
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    canvas.parentElement?.removeEventListener("pointermove", pointer);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
