import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Scene2Basis, SCENE2_DURATION, SCENE2_FPS } from "./scenes/Scene2Basis";
import { Scene1Hook, SCENE1_DURATION, SCENE1_FPS } from "./scenes/Scene1Hook";
import { Scene3Transform, SCENE3_DURATION, SCENE3_FPS } from "./scenes/Scene3Transform";
import { Scene4Columns, SCENE4_DURATION, SCENE4_FPS } from "./scenes/Scene4Columns";
import { Scene5Examples, SCENE5_DURATION, SCENE5_FPS } from "./scenes/Scene5Examples";
import { Scene6Determinant, SCENE6_DURATION, SCENE6_FPS } from "./scenes/Scene6Determinant";
import { Scene7Outro, SCENE7_DURATION, SCENE7_FPS } from "./scenes/Scene7Outro";
import { FullVideo, FULL_DURATION, FULL_FPS } from "./FullVideo";
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
      <Composition
        id="Scene4Columns"
        component={Scene4Columns}
        durationInFrames={SCENE4_DURATION}
        fps={SCENE4_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene5Examples"
        component={Scene5Examples}
        durationInFrames={SCENE5_DURATION}
        fps={SCENE5_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene6Determinant"
        component={Scene6Determinant}
        durationInFrames={SCENE6_DURATION}
        fps={SCENE6_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene7Outro"
        component={Scene7Outro}
        durationInFrames={SCENE7_DURATION}
        fps={SCENE7_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={FULL_DURATION}
        fps={FULL_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
