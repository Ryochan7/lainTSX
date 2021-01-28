import React, { useEffect, useMemo } from "react";
import middleRingTexture from "../../../../static/sprite/middle_ring_tex.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { useStore } from "../../../../store";

type MiddleRingPartProps = {
  position: number[];
  rotation: number[];
};

const MiddleRingPart = (props: MiddleRingPartProps) => {
  const middleRingTex = useLoader(THREE.TextureLoader, middleRingTexture);

  const middleRingPartTex = useMemo(() => {
    middleRingTex.repeat.set(0.4, 1);
    return middleRingTex;
  }, [middleRingTex]);

  const [posState, setPos] = useSpring(() => ({
    posX: props.position[0],
    posZ: props.position[2],
    config: { duration: 600 },
  }));

  const subscene = useStore((state) => state.mainSubscene);

  useEffect(() => {
    if (subscene === "pause") {
      const posX = props.position[0];
      const posZ = props.position[2];
      setTimeout(() => {
        setPos({ posX: posX / 0.9, posZ: posZ / 0.9 });
      }, 500);
      setTimeout(() => {
        setPos({ posX: posX, posZ: posZ });
      }, 900);
      setTimeout(() => {
        setPos({ posX: posX / 0.9, posZ: posZ / 0.9 });
      }, 1300);
      setTimeout(() => {
        setPos({ posX: posX, posZ: posZ });
      }, 1700);

      setTimeout(() => {
        setPos({ posX: posX / 0.2, posZ: posZ / 0.2 });
      }, 2500);

      setTimeout(() => {
        setPos({ posX: posX, posZ: posZ });
      }, 3200);
    }
  }, [props.position, setPos, subscene]);

  return (
    <a.group
      position-x={posState.posX}
      position-z={posState.posZ}
      position-y={props.position[1]}
      rotation={props.rotation as [number, number, number]}
    >
      <a.mesh scale={[0.16, 0.032, 0]}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          map={middleRingPartTex}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </a.mesh>
    </a.group>
  );
};

export default MiddleRingPart;
