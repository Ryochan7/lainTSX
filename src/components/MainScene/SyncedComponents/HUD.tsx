import React, { memo, useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import bigHud from "../../../static/sprite/big_hud.png";
import longHud from "../../../static/sprite/long_hud.png";
import boringHud from "../../../static/sprite/long_hud_boring.png";
import { a } from "@react-spring/three";
import { useStore } from "../../../store";
import { getNodeHud } from "../../../core/nodeSelector";
import lerp from "../../../core/utils/lerp";
import GreenTextRenderer from "../../TextRenderer/GreenTextRenderer";
import MediaSceneEventManager from "../../../core/StateManagers/MediaSceneEventManager";

export type HUDType = {
  mirrored: number;
  long: {
    position: number[];
    initial_position: number[];
  };
  boring: {
    position: number[];
    initial_position: number[];
  };
  big: {
    position: number[];
    initial_position: number[];
  };
  big_text: number[];
  medium_text: {
    position: number[];
    initial_position: number[];
  };
};

const HUD = memo(() => {
  const greenText = ["d", "i"];
  const activeRef = useRef(true);
  const currentHudRef = useRef(
    getNodeHud(useStore.getState().activeNodeMatrixIndices)
  );
  const activeNodeMatrixIndices = useStore(
    (state) => state.activeNodeMatrixIndices
  );

  useFrame(() => {
    if (
      longHudRef.current &&
      bigHudRef.current &&
      boringHudRef.current &&
      greenTextRef.current
    ) {
      longHudRef.current.position.x = lerp(
        longHudRef.current.position.x,
        !activeRef.current
          ? currentHudRef.current.long.initial_position[0]
          : currentHudRef.current.long.position[0],
        0.12
      );

      boringHudRef.current.position.x = lerp(
        boringHudRef.current.position.x,
        !activeRef.current
          ? currentHudRef.current.boring.initial_position[0]
          : currentHudRef.current.boring.position[0],
        0.12
      );

      bigHudRef.current.position.x = lerp(
        bigHudRef.current.position.x,
        !activeRef.current
          ? currentHudRef.current.big.initial_position[0]
          : currentHudRef.current.big.position[0],
        0.12
      );

      greenTextRef.current.position.x = lerp(
        greenTextRef.current.position.x,
        !activeRef.current
          ? currentHudRef.current.medium_text.initial_position[0]
          : currentHudRef.current.medium_text.position[0],
        0.12
      );
    }
  });

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current = false;
      setTimeout(() => {
        const hud = getNodeHud(activeNodeMatrixIndices);
        if (
          longHudRef.current &&
          bigHudRef.current &&
          boringHudRef.current &&
          greenTextRef.current
        ) {
          longHudRef.current.position.y = hud.long.position[1];
          boringHudRef.current.position.y = hud.boring.position[1];
          bigHudRef.current.position.y = hud.big.position[1];
          greenTextRef.current.position.y = hud.medium_text.position[1];

          longHudRef.current.position.x = hud.long.initial_position[0];
          boringHudRef.current.position.x = hud.boring.initial_position[0];
          bigHudRef.current.position.x = hud.big.initial_position[0];
          greenTextRef.current.position.x = hud.medium_text.initial_position[0];

          if (hud.mirrored) {
            longHudRef.current.scale.x = -Math.abs(longHudRef.current.scale.x);
            boringHudRef.current.scale.x = -Math.abs(
              boringHudRef.current.scale.x
            );
            bigHudRef.current.scale.x = -Math.abs(bigHudRef.current.scale.x);
          } else {
            longHudRef.current.scale.x = Math.abs(longHudRef.current.scale.x);
            boringHudRef.current.scale.x = Math.abs(
              boringHudRef.current.scale.x
            );
            bigHudRef.current.scale.x = Math.abs(bigHudRef.current.scale.x);
          }
          currentHudRef.current = hud;
          activeRef.current = true;
        }
      }, 500);
    }
  }, [activeNodeMatrixIndices]);

  const longHudRef = useRef<THREE.Object3D>();
  const boringHudRef = useRef<THREE.Object3D>();
  const bigHudRef = useRef<THREE.Object3D>();
  const greenTextRef = useRef<THREE.Object3D>();

  const longHudTex = useLoader(THREE.TextureLoader, longHud);
  const boringHudTex = useLoader(THREE.TextureLoader, boringHud);
  const bigHudTex = useLoader(THREE.TextureLoader, bigHud);

  // console.log("rend");
  return (
    <group position={[0, 0, 10]}>
      <a.mesh
        scale={[1, 0.03, 1]}
        renderOrder={2}
        ref={longHudRef}
        position-z={-8.6}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={longHudTex}
          transparent={true}
          depthTest={false}
        />
      </a.mesh>
      <a.mesh
        scale={[1, 0.03, 1]}
        renderOrder={2}
        ref={boringHudRef}
        position-z={-8.6}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={boringHudTex}
          transparent={true}
          depthTest={false}
        />
      </a.mesh>
      <a.mesh
        scale={[0.5, 0.06, 1]}
        renderOrder={2}
        ref={bigHudRef}
        position-z={-8.6}
      >
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={bigHudTex}
          transparent={true}
          depthTest={false}
        />
      </a.mesh>
      <a.group position-z={-8.7} scale={[0.02, 0.035, 0.02]} ref={greenTextRef}>
        <GreenTextRenderer />
      </a.group>
    </group>
  );
});

export default HUD;
