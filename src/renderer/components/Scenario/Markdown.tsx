import { MarkDownStep } from 'types/scenario';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  markdown: MarkDownStep;
}

const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown.content}</ReactMarkdown>
    </div>
  );
};
export default Markdown;
