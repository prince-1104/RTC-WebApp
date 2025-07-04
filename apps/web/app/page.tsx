import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import DrawingBoard from "../components/DrawingBoard";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const token = "HARDCODED_OR_FROM_CONTEXT";
  const roomId = "123";

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* ✅ Include DrawingBoard here */}
        <DrawingBoard token={token} roomId={roomId} />

        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a className={styles.primary} href="https://vercel.com/new/clone?...">
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://turborepo.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>

        <Button appName="web" className={styles.secondary}>
          Open alert
        </Button>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com/templates" target="_blank" rel="noopener noreferrer">
          <Image src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a href="https://turborepo.com" target="_blank" rel="noopener noreferrer">
          <Image src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  );
}
