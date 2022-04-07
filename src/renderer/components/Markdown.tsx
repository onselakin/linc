/* eslint-disable react/require-default-props */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Highlight from 'react-highlight';
import yaml from 'js-yaml';
import { useState } from 'react';
import { InvokeChannel } from '../../ipc';

interface CodeBlockConfig {
  specified: boolean;
  title?: string;
  language?: string;
  executable?: boolean;
  targetTerminal?: string;
  editable?: boolean;
  clipboard?: boolean;
  hint?: string;
  file?: string;
}

interface MarkdownProps {
  markdown: string;
  includes?: { [key: string]: string };
  onExecute?: (terminalId: string, command: string) => void;
  assetRoot?: string;
}

interface CodeBlockProps {
  config: CodeBlockConfig;
  code: string;
  onExecute?: (terminalId: string, command: string) => void;
}

const Button = ({ text, click }: { text: string; click: () => void }) => {
  return (
    <button
      type="button"
      className="rounded border border-purple-900 bg-purple-700 hover:bg-purple-500 ml-2 h-8 px-2 text-gray-200 cursor-pointer text-sm"
      onClick={click}
    >
      {text}
    </button>
  );
};

const InlineCodeBlock = ({ code, config, onExecute }: CodeBlockProps) => {
  if (!config.specified || !config?.executable)
    return <span className="rounded bg-black text-gray-300 p-2">{code}</span>;

  return (
    <button
      className="rounded rounded-md h-10 bg-black text-gray-300 p-2"
      type="button"
      onClick={() => {
        if (onExecute) onExecute(`${code}\r`, config.targetTerminal ?? '');
      }}
    >
      {code}
      <i className="fa-solid fa-arrow-turn-down fa-sm rotate-90 ml-2" />
    </button>
  );
};

const CodeBlock = ({ code, config, onExecute }: CodeBlockProps) => {
  const [solutionHidden, setSolutionHidden] = useState(config.hint !== undefined);
  const [hintVisible, setHintVisible] = useState(false);

  if (!config.specified) {
    return <Highlight className={`${config.language} rounded`}>{code}</Highlight>;
  }
  return (
    <div>
      <div className="flex flex-row rounded-tl-md rounded-tr-md bg-purple-800 overflow-hidden h-12 pr-2">
        <div className="flex flex-auto items-center text-gray-50">
          <p className="m-0 ml-4">{config.title}</p>
        </div>
        <div className="flex max-w-96 items-center justify-end">
          {solutionHidden && <Button text="Show Solution" click={() => setSolutionHidden(false)} />}
          {config.clipboard && !solutionHidden && <Button text="Copy" click={() => {}} />}
          {config.executable && !solutionHidden && (
            <Button
              text="Execute"
              click={() => {
                if (onExecute) onExecute(code, config.targetTerminal ?? '');
              }}
            />
          )}
        </div>
      </div>
      <div className="w-full relative not-prose">
        <Highlight className={`${config.language} ${solutionHidden ? 'blur-sm' : ''}`}>{code}</Highlight>
        <div className="absolute bottom-2 right-2 text-sm">
          {solutionHidden && !hintVisible && <Button text="Hint" click={() => setHintVisible(!hintVisible)} />}
        </div>
        {hintVisible && solutionHidden && (
          <div className="absolute rounded-b top-0 left-0 bottom-0 right-0 text-sm bg-purple-600 text-gray-100 p-2">
            <button type="button" onClick={() => setHintVisible(false)}>
              <i className="absolute top-8 right-2 m-0 fa-solid fa-circle-check fa-xl" />
            </button>
            {config.hint}
          </div>
        )}
      </div>
    </div>
  );
};

const Markdown = ({ markdown, includes, onExecute, assetRoot }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className="prose max-w-none"
      remarkPlugins={[remarkGfm]}
      components={{
        pre: 'div',
        code({ inline, className, children }) {
          const contents = children[0] as string;

          const match = /language-(\w+)/.exec(className || '');
          if (match && match[1] === 'text') {
            return <pre className="rounded">{contents}</pre>;
          }

          // Check for config
          let config: CodeBlockConfig = {
            language: '',
            specified: false,
          };

          const configRegex = /~[^{]*\{([^}]*)}\n?~\n?/gm;
          const dm = configRegex.exec(contents);
          if (dm !== null) {
            config = yaml.load(dm[1]) as CodeBlockConfig;
            config.specified = true;
          }

          if (match) {
            // eslint-disable-next-line prefer-destructuring
            config.language = match[1];
          }

          let finalContents: string;
          if (config.file && includes) {
            finalContents = includes[config.file];
          } else {
            // Remove config from the final output
            finalContents = contents.replace(configRegex, '');
          }

          if (inline) {
            return <InlineCodeBlock config={config} code={finalContents} onExecute={onExecute} />;
          }

          return match ? (
            <CodeBlock code={finalContents} config={config} onExecute={onExecute} />
          ) : (
            <div>[Unrecognized Code Block]</div>
          );
        },
        a({ href, children }) {
          if (href && (href.startsWith('https') || href.startsWith('http'))) {
            return (
              <button className="underline" type="button" onClick={() => InvokeChannel('window:open', { url: href })}>
                {children[0]}
                <i className="fa-solid fa-arrow-up-right-from-square fa-xs ml-1" />
              </button>
            );
          }
          return <a href={href}>{children[0]}</a>;
        },
        img({ alt, src }) {
          return <img alt={alt} src={`asset://${assetRoot}/assets/${src}`} />;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};
export default Markdown;
