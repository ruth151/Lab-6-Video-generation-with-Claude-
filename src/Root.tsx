import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Scene2Basis, SCENE2_DURATION, SCENE2_FPS } from "./scenes/Scene2Basis";
import { Scene1Hook, SCENE1_DURATION, SCENE1_FPS } from "./scenes/Scene1Hook";
import { Scene3Transform, SCENE3_DURATION, SCENE3_FPS } from "./scenes/Scene3Transform";
import { TestClip, TEST_CLIP_DURATION, TEST_CLIP_FPS } from "./TestClip";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
      <Composition
        id="TestClip"
        component={TestClip}
        durationInFrames={TEST_CLIP_DURATION}
        fps={TEST_CLIP_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene2Basis"
        component={Scene2Basis}
        durationInFrames={SCENE2_DURATION}
        fps={SCENE2_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene1Hook"
        component={Scene1Hook}
        durationInFrames={SCENE1_DURATION}
        fps={SCENE1_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3Transform"
        component={Scene3Transform}
        durationInFrames={SCENE3_DURATION}
        fps={SCENE3_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
