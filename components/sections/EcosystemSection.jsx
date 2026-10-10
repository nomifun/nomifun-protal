"use client";
import { useEffect, useRef, useState } from "react";
import Link from "@/components/i18n/LocaleLink";
import Icon from "@/components/Icon";
import { getProducts } from "@/lib/site";
import { arcPlacement, initArcSlider } from "@/lib/behaviors/arc-slider";
import { useLocale } from "@/components/i18n/LocaleProvider";

function DesktopArtwork() {
  return (
    <svg viewBox="0 0 560 350" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="eco-desktop-shell"
          x1="70"
          y1="30"
          x2="480"
          y2="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#413651" />
          <stop offset="1" stopColor="#15121d" />
        </linearGradient>
        <linearGradient
          id="eco-desktop-glow"
          x1="200"
          y1="90"
          x2="400"
          y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#dab9ff" />
          <stop offset="1" stopColor="#796ea3" />
        </linearGradient>
        <radialGradient id="eco-desktop-aura">
          <stop stopColor="#a278d1" stopOpacity=".24" />
          <stop offset="1" stopColor="#a278d1" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="eco-logo-bowl"
          x1="15"
          y1="49"
          x2="65"
          y2="69"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9FB4" />
          <stop offset="1" stopColor="#FF6F91" />
        </linearGradient>
      </defs>
      <ellipse
        cx="280"
        cy="174"
        rx="259"
        ry="174"
        fill="url(#eco-desktop-aura)"
      />
      <ellipse
        cx="281"
        cy="313"
        rx="200"
        ry="13"
        fill="#5a3d75"
        fillOpacity=".13"
      />
      <g className="eco-device-float">
        <rect
          x="66"
          y="30"
          width="428"
          height="260"
          rx="19"
          fill="url(#eco-desktop-shell)"
          stroke="#6a5b7c"
          strokeWidth="2"
        />
        <rect x="76" y="40" width="408" height="240" rx="10" fill="#1e1a28" />
        <path d="M76 65H484" stroke="#766586" strokeOpacity=".25" />
        <circle cx="88" cy="53" r="3" fill="#f49c9a" />
        <circle cx="99" cy="53" r="3" fill="#dfc893" />
        <circle cx="110" cy="53" r="3" fill="#a5c9ab" />
        <text
          x="252"
          y="55"
          fill="#c6b8d5"
          fontSize="8"
          fontFamily="sans-serif"
          letterSpacing="1.5"
        >
          NOMIFUN
        </text>
        <rect x="89" y="79" width="66" height="184" rx="7" fill="#2c253b" />
        <rect x="98" y="89" width="48" height="22" rx="5" fill="#4a3d61" />
        <path
          d="M106 100H137"
          stroke="#c4a5e1"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {[128, 148, 168, 188, 208].map((y) => (
          <path
            key={y}
            d={`M105 ${y}H137`}
            stroke="#766888"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
        <path
          d="M280 173L204 124M280 173L362 115M280 173L214 224M280 173L377 225"
          stroke="#a889c9"
          strokeOpacity=".55"
        />
        <path
          className="eco-signal-line"
          d="M280 173L204 124M280 173L362 115M280 173L214 224M280 173L377 225"
          stroke="#e9cfff"
          strokeWidth="2"
          strokeDasharray="3 52"
        />
        <circle cx="280" cy="173" r="47" stroke="#a98bc9" strokeOpacity=".3" />
        <circle
          className="eco-core-ring"
          cx="280"
          cy="173"
          r="38"
          stroke="#c6a0ec"
          strokeDasharray="5 8"
        />
        <circle cx="280" cy="173" r="28" fill="url(#eco-desktop-glow)" />
        <g transform="translate(280 176) scale(0.72) translate(-40 -52)">
          <path
            d="M33 17 q-4.5 -4 0 -8.5"
            stroke="#FFD7DE"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M40 15 q-4.5 -4 0 -8.5"
            stroke="#FFE9EE"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M47 17 q-4.5 -4 0 -8.5"
            stroke="#FFD7DE"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M22 46 Q22 27 40 27 Q58 27 58 46 Z" fill="#FFFFFF" />
          <path
            d="M14 49 H66 Q61.5 70 40 70 Q18.5 70 14 49 Z"
            fill="url(#eco-logo-bowl)"
          />
        </g>
        <g className="eco-floating-node eco-node-one">
          <rect x="174" y="104" width="68" height="39" rx="9" fill="#bca1dc" />
          <text
            x="186"
            y="127"
            fill="#342644"
            fontSize="10"
            fontFamily="sans-serif"
          >
            AGENT A
          </text>
        </g>
        <g className="eco-floating-node eco-node-two">
          <rect x="330" y="93" width="77" height="43" rx="9" fill="#d6bb9c" />
          <text
            x="341"
            y="118"
            fill="#443323"
            fontSize="10"
            fontFamily="sans-serif"
          >
            CREATIVE
          </text>
        </g>
        <g className="eco-floating-node eco-node-three">
          <rect x="174" y="206" width="78" height="40" rx="9" fill="#a6c6b5" />
          <text
            x="187"
            y="229"
            fill="#293e34"
            fontSize="10"
            fontFamily="sans-serif"
          >
            MEMORY
          </text>
        </g>
        <g className="eco-floating-node eco-node-four">
          <rect x="335" y="203" width="92" height="41" rx="9" fill="#a6bacd" />
          <text
            x="349"
            y="227"
            fill="#2b3948"
            fontSize="10"
            fontFamily="sans-serif"
          >
            AUTOWORK
          </text>
        </g>
        <path d="M250 291H310L318 309H242L250 291Z" fill="#67586e" />
        <path
          d="M216 312H344"
          stroke="#95889d"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
      <g className="eco-orbit-label">
        <rect
          x="14"
          y="175"
          width="74"
          height="29"
          rx="14.5"
          fill="#fff"
          fillOpacity=".8"
        />
        <circle cx="28" cy="190" r="3" fill="#8975a0" />
        <text
          x="39"
          y="193"
          fill="#665474"
          fontSize="9"
          fontFamily="sans-serif"
        >
          LOCAL
        </text>
      </g>
      <g className="eco-orbit-label eco-label-late">
        <rect
          x="423"
          y="250"
          width="115"
          height="29"
          rx="14.5"
          fill="#fff"
          fillOpacity=".85"
        />
        <circle cx="437" cy="265" r="3" fill="#7f9c89" />
        <text
          x="448"
          y="268"
          fill="#665474"
          fontSize="9"
          fontFamily="sans-serif"
        >
          YOUR COMPUTER
        </text>
      </g>
    </svg>
  );
}

function MobileArtwork() {
  return (
    <svg viewBox="0 0 560 350" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="eco-phone-shell"
          x1="203"
          y1="17"
          x2="374"
          y2="330"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#483a33" />
          <stop offset=".55" stopColor="#171515" />
          <stop offset="1" stopColor="#5b4940" />
        </linearGradient>
        <linearGradient
          id="eco-phone-screen"
          x1="228"
          y1="55"
          x2="367"
          y2="286"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff5ea" />
          <stop offset="1" stopColor="#e9cbb1" />
        </linearGradient>
      </defs>
      <ellipse
        cx="280"
        cy="323"
        rx="130"
        ry="13"
        fill="#a67b59"
        fillOpacity=".13"
      />
      <g className="eco-radio-waves">
        <circle
          cx="280"
          cy="175"
          r="128"
          stroke="#b98e70"
          strokeOpacity=".23"
        />
        <circle
          cx="280"
          cy="175"
          r="156"
          stroke="#b98e70"
          strokeOpacity=".16"
        />
        <circle
          cx="280"
          cy="175"
          r="180"
          stroke="#b98e70"
          strokeOpacity=".08"
        />
      </g>
      <g className="eco-device-float">
        <rect
          x="198"
          y="16"
          width="164"
          height="311"
          rx="28"
          fill="url(#eco-phone-shell)"
          stroke="#927461"
          strokeWidth="2"
        />
        <rect
          x="206"
          y="24"
          width="148"
          height="294"
          rx="22"
          fill="url(#eco-phone-screen)"
        />
        <rect x="252" y="29" width="56" height="13" rx="6.5" fill="#28201e" />
        <circle cx="299" cy="35.5" r="2.5" fill="#5c6770" />
        <text
          x="218"
          y="63"
          fill="#7d6558"
          fontSize="8"
          fontFamily="sans-serif"
        >
          09:41
        </text>
        <path d="M326 58H341V63H326Z" stroke="#8f796a" strokeWidth="1.4" />
        <text
          x="222"
          y="90"
          fill="#4e3d33"
          fontSize="16"
          fontFamily="sans-serif"
          fontWeight="600"
        >
          NomiFun
        </text>
        <rect
          x="221"
          y="101"
          width="119"
          height="25"
          rx="8"
          fill="#fff"
          fillOpacity=".6"
        />
        <circle
          className="eco-status-pulse"
          cx="233"
          cy="113.5"
          r="3"
          fill="#83a78a"
        />
        <text
          x="241"
          y="117"
          fill="#6c7963"
          fontSize="8"
          fontFamily="sans-serif"
        >
          DESKTOP CONNECTED
        </text>
        <circle cx="232" cy="153" r="12" fill="#c8aa8e" />
        <g transform="translate(232 156) scale(0.22) translate(-40 -52)">
          <path d="M22 46 Q22 27 40 27 Q58 27 58 46 Z" fill="#fff6e9" />
          <path
            d="M14 49 H66 Q61.5 70 40 70 Q18.5 70 14 49 Z"
            fill="#f6b7a5"
          />
        </g>
        <rect
          x="252"
          y="142"
          width="88"
          height="47"
          rx="11"
          fill="#fff"
          fillOpacity=".78"
        />
        <path
          d="M262 156H325M262 164H315M262 172H293"
          stroke="#b69a82"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="241" y="200" width="99" height="37" rx="11" fill="#bb9a7e" />
        <path
          d="M252 214H326M252 223H295"
          stroke="#fff3e6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="221"
          y="252"
          width="119"
          height="40"
          rx="12"
          fill="#fff"
          fillOpacity=".72"
        />
        <path
          d="M232 272H287"
          stroke="#b8a18d"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="322" cy="272" r="11" fill="#c59e7c" />
        <path d="M319 277V267L325 272L319 277Z" fill="#fff5e9" />
        <path
          d="M256 306H304"
          stroke="#8f796c"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g className="eco-orbit-label">
        <rect
          x="41"
          y="92"
          width="131"
          height="42"
          rx="14"
          fill="#fff"
          fillOpacity=".8"
        />
        <circle cx="59" cy="113" r="6" fill="#bb9b7d" />
        <text
          x="75"
          y="117"
          fill="#846852"
          fontSize="10"
          fontFamily="sans-serif"
        >
          CONTINUE ANYWHERE
        </text>
      </g>
      <g className="eco-orbit-label eco-label-late">
        <rect
          x="364"
          y="236"
          width="148"
          height="44"
          rx="14"
          fill="#fff"
          fillOpacity=".8"
        />
        <circle
          className="eco-status-pulse"
          cx="383"
          cy="258"
          r="5"
          fill="#87a38a"
        />
        <text
          x="399"
          y="261"
          fill="#846852"
          fontSize="10"
          fontFamily="sans-serif"
        >
          WORK IN PROGRESS
        </text>
      </g>
      <path
        className="eco-signal-line"
        d="M172 113H196M365 257H342"
        stroke="#bc936e"
        strokeWidth="2"
        strokeDasharray="3 9"
      />
    </svg>
  );
}

function RobotArtwork() {
  return (
    <svg viewBox="0 0 560 350" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="eco-robot-shell"
          x1="170"
          y1="83"
          x2="390"
          y2="259"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffdf0" />
          <stop offset=".52" stopColor="#d9e4d2" />
          <stop offset="1" stopColor="#a4b8a0" />
        </linearGradient>
        <linearGradient
          id="eco-robot-base"
          x1="218"
          y1="235"
          x2="369"
          y2="317"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e7efdf" />
          <stop offset="1" stopColor="#8faaa0" />
        </linearGradient>
        <linearGradient
          id="eco-robot-face"
          x1="214"
          y1="127"
          x2="347"
          y2="211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#314b46" />
          <stop offset="1" stopColor="#152c28" />
        </linearGradient>
      </defs>
      <ellipse
        cx="280"
        cy="314"
        rx="127"
        ry="17"
        fill="#507966"
        fillOpacity=".13"
      />
      <path
        className="eco-robot-scan"
        d="M121 241Q87 174 132 112M438 241Q473 174 430 112"
        stroke="#83a48b"
        strokeOpacity=".35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="eco-robot-scan eco-scan-delay"
        d="M143 228Q116 175 151 128M417 228Q444 175 409 128"
        stroke="#83a48b"
        strokeOpacity=".6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g className="eco-device-float">
        <path d="M251 225H309L318 264H242L251 225Z" fill="#789285" />
        <rect x="239" y="249" width="82" height="23" rx="11" fill="#b2c8b9" />
        <path
          d="M220 277Q225 254 250 254H310Q335 254 340 277L351 297Q354 312 333 315H227Q206 312 209 297L220 277Z"
          fill="url(#eco-robot-base)"
          stroke="#90aa98"
        />
        <ellipse cx="280" cy="280" rx="50" ry="16" fill="#d1e0cd" />
        <circle
          className="eco-status-pulse"
          cx="280"
          cy="297"
          r="4"
          fill="#72ab7c"
        />
        <g className="eco-robot-head">
          <path
            d="M202 104Q213 83 248 83H312Q347 83 358 104L375 154Q381 181 364 207L349 224Q338 234 318 234H242Q222 234 211 224L196 207Q179 181 185 154L202 104Z"
            fill="url(#eco-robot-shell)"
            stroke="#9eb4a0"
            strokeWidth="1.5"
          />
          <rect x="192" y="140" width="12" height="45" rx="6" fill="#b6cbbb" />
          <rect x="356" y="140" width="12" height="45" rx="6" fill="#9db8aa" />
          <rect
            x="207"
            y="113"
            width="146"
            height="97"
            rx="34"
            fill="url(#eco-robot-face)"
            stroke="#9bb5a8"
            strokeWidth="2"
          />
          <path
            d="M219 143Q224 123 244 124H317"
            stroke="#e3f1d9"
            strokeOpacity=".16"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <g className="eco-robot-eyes">
            <rect
              x="238"
              y="143"
              width="18"
              height="28"
              rx="9"
              fill="#b4e3b7"
            />
            <rect
              x="304"
              y="143"
              width="18"
              height="28"
              rx="9"
              fill="#b4e3b7"
            />
          </g>
          <path
            d="M270 183Q280 191 290 183"
            stroke="#b4e3b7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="280" cy="96" r="3" fill="#7a9d8a" />
        </g>
      </g>
      <g className="eco-orbit-label">
        <rect
          x="35"
          y="225"
          width="119"
          height="37"
          rx="13"
          fill="#fff"
          fillOpacity=".7"
        />
        <path
          d="M50 240V249M55 237V252M60 240V249"
          stroke="#77937c"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="72"
          y="247"
          fill="#62816c"
          fontSize="10"
          fontFamily="sans-serif"
        >
          SAME MEMORY
        </text>
      </g>
      <g className="eco-orbit-label eco-label-late">
        <rect
          x="382"
          y="74"
          width="133"
          height="38"
          rx="13"
          fill="#fff"
          fillOpacity=".7"
        />
        <circle
          className="eco-status-pulse"
          cx="399"
          cy="93"
          r="4"
          fill="#87a387"
        />
        <text
          x="411"
          y="97"
          fill="#62816c"
          fontSize="10"
          fontFamily="sans-serif"
        >
          HELLO, REAL WORLD
        </text>
      </g>
    </svg>
  );
}

function NetworkArtwork() {
  return (
    <svg viewBox="0 0 560 350" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id="eco-net-hub"
          x1="222"
          y1="119"
          x2="331"
          y2="248"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#536b83" />
          <stop offset="1" stopColor="#243645" />
        </linearGradient>
        <linearGradient
          id="eco-net-line"
          x1="91"
          y1="92"
          x2="478"
          y2="269"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a6bacf" />
          <stop offset=".5" stopColor="#f4f9ff" />
          <stop offset="1" stopColor="#a6bacf" />
        </linearGradient>
      </defs>
      <ellipse
        cx="280"
        cy="180"
        rx="196"
        ry="125"
        stroke="#90a9c0"
        strokeOpacity=".24"
      />
      <ellipse
        cx="280"
        cy="180"
        rx="142"
        ry="87"
        stroke="#90a9c0"
        strokeOpacity=".3"
        strokeDasharray="2 8"
      />
      <path
        d="M280 180L103 96M280 180L451 94M280 180L442 264M280 180L109 271"
        stroke="url(#eco-net-line)"
        strokeWidth="2"
      />
      <path
        className="eco-signal-line eco-net-packets"
        d="M280 180L103 96M280 180L451 94M280 180L442 264M280 180L109 271"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 52"
      />
      <g className="eco-device-float">
        <rect
          x="222"
          y="122"
          width="116"
          height="116"
          rx="31"
          fill="url(#eco-net-hub)"
          stroke="#94aac1"
          strokeWidth="2"
        />
        <rect
          x="232"
          y="132"
          width="96"
          height="96"
          rx="24"
          stroke="#90a9c0"
          strokeOpacity=".3"
        />
        <g transform="translate(280 183) scale(0.62) translate(-40 -52)">
          <path
            d="M33 17 q-4.5 -4 0 -8.5"
            stroke="#cfe8f5"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M40 15 q-4.5 -4 0 -8.5"
            stroke="#e8f4ff"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M47 17 q-4.5 -4 0 -8.5"
            stroke="#cfe8f5"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M22 46 Q22 27 40 27 Q58 27 58 46 Z" fill="#ffffff" />
          <path
            d="M14 49 H66 Q61.5 70 40 70 Q18.5 70 14 49 Z"
            fill="url(#eco-logo-bowl)"
          />
        </g>
        <circle
          className="eco-status-pulse"
          cx="280"
          cy="211"
          r="3"
          fill="#b9dcbf"
        />
      </g>
      <g className="eco-floating-node eco-node-one">
        <rect
          x="54"
          y="56"
          width="99"
          height="78"
          rx="15"
          fill="#f8fcff"
          fillOpacity=".75"
          stroke="#adc0d1"
        />
        <rect x="69" y="68" width="69" height="40" rx="5" fill="#a2b6ca" />
        <path
          d="M96 111V119M85 119H121"
          stroke="#8199b0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M79 80H97M79 88H121M79 96H109"
          stroke="#eef5fc"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <g className="eco-floating-node eco-node-two">
        <rect
          x="420"
          y="45"
          width="58"
          height="98"
          rx="14"
          fill="#647d95"
          stroke="#a1b7cb"
        />
        <rect x="426" y="52" width="46" height="83" rx="9" fill="#d6e5f3" />
        <path
          d="M440 56H458M439 126H459"
          stroke="#8fa6bc"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="449" cy="87" r="12" fill="#a7bfd4" />
        <path
          d="M436 111H462"
          stroke="#a0b6cb"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g className="eco-floating-node eco-node-three">
        <rect
          x="62"
          y="234"
          width="97"
          height="71"
          rx="16"
          fill="#f8fcff"
          fillOpacity=".75"
          stroke="#adc0d1"
        />
        <rect x="79" y="249" width="64" height="35" rx="13" fill="#69869b" />
        <rect x="94" y="257" width="5" height="11" rx="2.5" fill="#d8efe0" />
        <rect x="121" y="257" width="5" height="11" rx="2.5" fill="#d8efe0" />
        <path
          d="M107 275Q110 278 114 275"
          stroke="#d8efe0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M101 292H119"
          stroke="#91a8bc"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g className="eco-floating-node eco-node-four">
        <rect
          x="403"
          y="229"
          width="83"
          height="81"
          rx="18"
          fill="#f8fcff"
          fillOpacity=".75"
          stroke="#adc0d1"
        />
        {[248, 262, 276].map((y) => (
          <g key={y}>
            <rect x="418" y={y} width="53" height="10" rx="3" fill="#a4bbce" />
            <circle cx="425" cy={y + 5} r="1.5" fill="#f1fbf5" />
          </g>
        ))}
        <text
          x="421"
          y="299"
          fill="#738ba0"
          fontSize="8"
          fontFamily="sans-serif"
        >
          SELF HOSTED
        </text>
      </g>
      <g className="eco-orbit-label">
        <rect
          x="233"
          y="38"
          width="95"
          height="26"
          rx="13"
          fill="#fff"
          fillOpacity=".8"
        />
        <text
          x="249"
          y="55"
          fill="#6b859c"
          fontSize="10"
          fontFamily="sans-serif"
        >
          NOMIRELAY
        </text>
      </g>
      <g className="eco-orbit-label eco-label-late">
        <rect
          x="211"
          y="288"
          width="138"
          height="28"
          rx="14"
          fill="#fff"
          fillOpacity=".8"
        />
        <text
          x="228"
          y="306"
          fill="#6b859c"
          fontSize="9"
          fontFamily="sans-serif"
        >
          YOUR NETWORK. YOURS.
        </text>
      </g>
    </svg>
  );
}

function ModelGatewayArtwork() {
  return (
    <svg viewBox="0 0 560 350" fill="none" aria-hidden="true">
      <ellipse
        cx="280"
        cy="178"
        rx="220"
        ry="145"
        stroke="#80ab96"
        strokeOpacity=".3"
      />
      <path d="M86 175H174M436 175H480" stroke="#81ad96" strokeWidth="2" />
      <path
        className="eco-signal-line"
        d="M86 175H174M436 175H480"
        stroke="#f4fff8"
        strokeWidth="4"
        strokeDasharray="3 30"
      />
      <g className="eco-device-float">
        <rect
          x="166"
          y="53"
          width="272"
          height="248"
          rx="24"
          fill="#28483e"
          stroke="#83ac96"
          strokeWidth="2"
        />
        <path d="M166 99H438" stroke="#83ac96" strokeOpacity=".35" />
        <circle
          className="eco-status-pulse"
          cx="189"
          cy="77"
          r="4"
          fill="#b9dfc4"
        />
        <text
          x="205"
          y="81"
          fill="#e4f4e9"
          fontSize="12"
          fontFamily="sans-serif"
          letterSpacing="1"
        >
          MODEL GATEWAY
        </text>
        {[
          ["MODELS", 185, 119],
          ["API KEYS", 310, 119],
          ["USAGE", 185, 205],
          ["WALLET", 310, 205],
        ].map(([label, x, y]) => (
          <g key={label}>
            <rect
              x={x}
              y={y}
              width="108"
              height="70"
              rx="12"
              fill="#426858"
              stroke="#8eb7a0"
              strokeOpacity=".4"
            />
            <path
              d={`M${x + 16} ${y + 20}H${x + 47}`}
              stroke="#bce0c7"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d={`M${x + 16} ${y + 30}H${x + 75}`}
              stroke="#8ab59b"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <text
              x={x + 16}
              y={y + 54}
              fill="#e3f3e8"
              fontSize="9"
              fontFamily="sans-serif"
              letterSpacing=".8"
            >
              {label}
            </text>
          </g>
        ))}
      </g>
      <g className="eco-floating-node eco-node-one">
        <rect
          x="26"
          y="142"
          width="80"
          height="67"
          rx="15"
          fill="#eef8f0"
          stroke="#9ec4ab"
        />
        <rect
          x="49"
          y="156"
          width="34"
          height="22"
          rx="4"
          stroke="#507b63"
          strokeWidth="2"
        />
        <path
          d="M59 182H73"
          stroke="#507b63"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="44"
          y="198"
          fill="#507b63"
          fontSize="9"
          fontFamily="sans-serif"
        >
          CLIENTS
        </text>
      </g>
      <g className="eco-floating-node eco-node-two">
        <rect
          x="464"
          y="133"
          width="82"
          height="85"
          rx="15"
          fill="#eef8f0"
          stroke="#9ec4ab"
        />
        {[150, 166, 182].map((y) => (
          <path
            key={y}
            d={`M482 ${y}H528`}
            stroke="#83aa91"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}
        <text
          x="474"
          y="204"
          fill="#507b63"
          fontSize="8"
          fontFamily="sans-serif"
        >
          PROVIDERS
        </text>
      </g>
      <g className="eco-orbit-label">
        <rect
          x="35"
          y="64"
          width="118"
          height="30"
          rx="15"
          fill="#fff"
          fillOpacity=".75"
        />
        <text x="52" y="83" fill="#507b63" fontSize="9" fontFamily="sans-serif">
          YOUR PRICING
        </text>
      </g>
      <g className="eco-orbit-label eco-label-late">
        <rect
          x="363"
          y="314"
          width="153"
          height="28"
          rx="14"
          fill="#fff"
          fillOpacity=".75"
        />
        <text
          x="381"
          y="332"
          fill="#507b63"
          fontSize="9"
          fontFamily="sans-serif"
        >
          SELF-HOSTED SERVICE
        </text>
      </g>
    </svg>
  );
}

const artwork = {
  desktop: DesktopArtwork,
  mobile: MobileArtwork,
  "xiaozhi-yuntai": RobotArtwork,
  "net-infra": NetworkArtwork,
  "model-gateway": ModelGatewayArtwork,
};
const badges = {
  desktop: "THE LOCAL BRAIN",
  mobile: "TAKE IT WITH YOU",
  "xiaozhi-yuntai": "MEET IN REAL LIFE",
  "net-infra": "STAY CONNECTED",
  "model-gateway": "BUILD YOUR SERVICE",
};

export default function EcosystemSection() {
  const { locale, t } = useLocale();
  const products = getProducts(locale);
  const stage = useRef(null);
  const slider = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    slider.current = initArcSlider(stage.current, { onChange: setActive });
    return () => {
      slider.current?.destroy();
      slider.current = null;
    };
  }, []);
  return (
    <section className="ecosystem-section arc-ecosystem" id="ecosystem">
      <div className="container">
        <div className="ecosystem-heading" data-reveal>
          <p className="eyebrow">ONE ECOSYSTEM. MANY WAYS IN.</p>
          <h2 className="section-heading">
            {t("以电脑为中心，", "Your computer at the center.")}
            <br />
            {t("让可能性延伸到身边。", "More possibilities within reach.")}
          </h2>
          <p>
            {t(
              "桌面、手机、机器人、跨网连接与模型商业服务。五个开源项目，各司其职。",
              "Desktop, mobile, robots, cross-network connections, and commercial model services. Five open-source projects, each with a purpose.",
            )}
          </p>
        </div>
      </div>
      <div
        ref={stage}
        className="ecosystem-stage"
        role="region"
        aria-roledescription={t("轮播", "carousel")}
        aria-label={t(
          "开源生态弧形展示，可拖动或使用左右方向键",
          "Open-source ecosystem carousel. Drag or use the left and right arrow keys.",
        )}
        tabIndex={0}
      >
        <div className="arc-horizon" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="arc-stage-coordinates" aria-hidden="true">
          <span>LOCAL AT HEART</span>
          <span>CONNECTED BY DESIGN</span>
        </div>
        {products.map((product, index) => {
          const placement = arcPlacement(index, 0, products.length);
          const Artwork = artwork[product.slug];
          return (
            <article
              key={product.slug}
              data-arc-card={index}
              data-status={index === 0 ? "active" : "inview"}
              className={`ecosystem-card eco-${product.slug}${index === 0 ? " is-active" : ""}`}
              style={{
                transform: `translateX(-50%) rotate(${placement.rotation}deg) scale(${placement.scale})`,
                opacity: placement.opacity,
                zIndex: 50 - Math.abs(placement.distance) * 10,
              }}
              aria-hidden={index !== 0}
              aria-roledescription={t("展示卡片", "slide")}
              aria-label={`${index + 1} / ${products.length}, ${product.name}`}
            >
              <div className="eco-card-top">
                <span>{product.number} / OPEN SOURCE</span>
                <span className="eco-product-badge">
                  <i />
                  {badges[product.slug]}
                </span>
              </div>
              <div className="eco-art">
                <Artwork />
              </div>
              <div className="eco-card-copy">
                <small>{product.category}</small>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <Link
                  href={`/products/${product.slug}`}
                  tabIndex={index === 0 ? 0 : -1}
                >
                  {t("认识", "Meet")} {product.shortName}
                  <Icon name="ArrowUpRight" size={21} />
                </Link>
              </div>
            </article>
          );
        })}
        <div className="arc-drag-badge" data-arc-badge aria-hidden="true">
          <Icon name="ArrowLeft" size={14} />
          <span>DRAG</span>
          <Icon name="ArrowRight" size={14} />
        </div>
      </div>
      <div className="ecosystem-controls">
        <button
          aria-label={t("上一个开源产品", "Previous open-source product")}
          onClick={() => slider.current?.previous()}
        >
          <Icon name="ArrowLeft" size={22} />
        </button>
        <div className="arc-product-index">
          <span>
            {String(active + 1).padStart(2, "0")}{" "}
            <i>/ {String(products.length).padStart(2, "0")}</i>
          </span>
          <div className="arc-product-dots">
            {products.map((product, index) => (
              <button
                key={product.slug}
                className={active === index ? "is-current" : ""}
                aria-label={`${t("查看", "View")} ${product.name}`}
                aria-pressed={active === index}
                onClick={() => slider.current?.goTo(index)}
              />
            ))}
          </div>
        </div>
        <button
          aria-label={t("下一个开源产品", "Next open-source product")}
          onClick={() => slider.current?.next()}
        >
          <Icon name="ArrowRight" size={22} />
        </button>
      </div>
      <p className="arc-hint">
        {t(
          "左右拖动，让下一种可能转到眼前。",
          "Drag left or right to bring the next possibility into view.",
        )}
      </p>
      <p className="arc-live-status" aria-live="polite" aria-atomic="true">
        {active + 1} / {products.length}: {products[active].name}
      </p>
      <div className="ecosystem-bottom container">
        <p>
          <strong>{t("电脑即服务。", "Your computer is the service.")}</strong>{" "}
          {t(
            "手机与机器人可在可信局域网直连，无需额外业务服务部署。",
            "Phones and robots connect directly on a trusted LAN, without deploying an additional application server.",
          )}
          <br />
          {t(
            "跨网访问时，可自行部署 Net Infra，接入你自己的传输通道。",
            "For access across networks, self-host Net Infra and use your own transport channels.",
          )}
          <br />
          {t(
            "想为社区或团队提供模型服务，可用 Model Gateway 定制自己的 Token 价格、钱包与订阅。",
            "To serve a community or team, use Model Gateway to configure your own token prices, wallets, and subscriptions.",
          )}
        </p>
        <Link href="/products" className="button light">
          {t("探索开源矩阵", "Explore the ecosystem")}
          <Icon name="ArrowUpRight" size={18} />
        </Link>
      </div>
    </section>
  );
}
