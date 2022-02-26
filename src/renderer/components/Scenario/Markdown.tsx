import { MarkDownStep } from 'types/scenario';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Highlight from 'react-highlight';

const directiveRegex = /~~[^{]*\{([^}]*)}\n?~~\n?/gm;

interface Directive {
  executable: boolean;
  clipboard: boolean;
}

interface MarkdownProps {
  markdown: MarkDownStep;
}

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  return (
    <div className="rounded">
      <Highlight className="js">{code}</Highlight>
    </div>
  );
};

const InlineCode = ({ code }: CodeBlockProps) => {
  return <span className="rounded bg-[#1F2937] text-gray-300 p-2">{code}</span>;
};

const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: 'div',
          code({ inline, className, children }) {
            const contents = children[0] as string;

            // Check for directives
            let directive: Directive;
            const dm = directiveRegex.exec(contents);
            if (dm !== null) {
              // Fix relaxed JSON
              const json = `{ ${dm[1]} }`.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
              directive = JSON.parse(json);
            }

            // Remove directive from the final output
            const finalContents = contents.replace(directiveRegex, '');
            const match = /language-(\w+)/.exec(className || '');
            if (inline) {
              return <InlineCode code={finalContents} />;
            }
            return match ? <CodeBlock code={finalContents} /> : <div>[Unrecognized Code Block]</div>;
          },
        }}
      >
        {markdown.content}
      </ReactMarkdown>
    </div>
  );
};
export default Markdown;
