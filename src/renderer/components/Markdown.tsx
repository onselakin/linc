import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Highlight from 'react-highlight';
import yaml from 'js-yaml';
import { useState } from 'react';
import checkIcon from '../../../assets/check.png';

const configRegex = /~[^{]*\{([^}]*)}\n?~\n?/gm;

interface CodeBlockConfig {
  defined: boolean;
  title?: string;
  language?: string;
  executable?: boolean;
  editable?: boolean;
  clipboard?: boolean;
  hint?: string;
}

interface MarkdownProps {
  markdown: string;
}

interface CodeBlockProps {
  config: CodeBlockConfig;
  code: string;
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

const InlineCode = ({ code }: CodeBlockProps) => {
  return <span className="rounded bg-[#1F2937] text-gray-300 p-2">{code}</span>;
};

const CodeBlock = ({ code, config }: CodeBlockProps) => {
  const [solutionHidden, setSolutionHidden] = useState(config.hint !== undefined);
  const [hintVisible, setHintVisible] = useState(false);

  if (!config.defined) {
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
          {config.executable && !solutionHidden && <Button text="Execute" click={() => {}} />}
        </div>
      </div>
      <div className="w-full relative">
        <Highlight className={`${config.language} ${solutionHidden ? 'blur-sm' : ''}`}>{code}</Highlight>
        <div className="absolute bottom-2 right-2 text-sm">
          {solutionHidden && !hintVisible && <Button text="Hint" click={() => setHintVisible(!hintVisible)} />}
        </div>
        {hintVisible && solutionHidden && (
          <div className="absolute rounded-b top-0 left-0 bottom-0 right-0 text-sm bg-purple-600 text-gray-100 p-2">
            <button type="button" onClick={() => setHintVisible(false)}>
              <img className="absolute top-2 right-2 m-0 w-8 h-8" src={checkIcon} alt="" />
            </button>
            {config.hint}
          </div>
        )}
      </div>
    </div>
  );
};

const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className="prose max-w-none"
      remarkPlugins={[remarkGfm]}
      components={{
        pre: 'div',
        code({ inline, className, children }) {
          const contents = children[0] as string;

          // Check for config
          let config: CodeBlockConfig = {
            language: '',
            defined: false,
          };
          const dm = configRegex.exec(contents);
          if (dm !== null) {
            config = yaml.load(dm[1]) as CodeBlockConfig;
            config.defined = true;
          }

          // Remove config from the final output
          const finalContents = contents.replace(configRegex, '');
          const match = /language-(\w+)/.exec(className || '');
          if (match) {
            // eslint-disable-next-line prefer-destructuring
            config.language = match[1];
          }
          if (inline) {
            return <InlineCode code={finalContents} config={config} />;
          }
          return match ? <CodeBlock code={finalContents} config={config} /> : <div>[Unrecognized Code Block]</div>;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};
export default Markdown;
