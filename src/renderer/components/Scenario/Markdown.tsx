import { MarkDownStep } from 'types/scenario';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Highlight from 'react-highlight';

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

const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: 'div',
          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? <CodeBlock code={children[0] as string} /> : <div>[Unrecognized Code Block</div>;
          },
        }}
      >
        {markdown.content}
      </ReactMarkdown>
    </div>
  );
};
export default Markdown;
