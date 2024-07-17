import {useGLTF} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";

export default function Model({url}: {url: string}) {
    const {scene} = useGLTF(url);
    return (
        <div style={{
            width: '100px',
            height: '100px',
        }}>
            <Canvas>
                {/*<color attach="background" args={"transparent"}/>*/}
                <primitive /* key={randInt(0, 1000000)} */ object={scene}></primitive>
            </Canvas>
        </div>
    );
}
