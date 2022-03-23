import Lab from 'types/lab';

type SyllabusProps = {
  lab: Lab;
};

const Syllabus = ({ lab }: SyllabusProps) => {
  return (
    <div>
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {lab.scenarios.map(s => (
          <li className="mb-10 ml-4" key={s.id}>
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
            <h4 className="text-md font-semibold text-gray-900 dark:text-white">{s.title}</h4>
            <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">{s.description}</p>
            {s.estimatedTime && (
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                Estimated time: {s.estimatedTime}
              </time>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
export default Syllabus;
