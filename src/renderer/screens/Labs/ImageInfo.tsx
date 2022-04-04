/* eslint-disable react/require-default-props */

/* eslint-disable react/no-array-index-key */

export interface ImageHistory {
  imageName: string;
  history: ImageHistoryItem[];
}

export interface ImageHistoryItem {
  createdBy: string;
}

type ImageInfoProps = {
  history?: ImageHistory[];
};

const ImageInfo = ({ history }: ImageInfoProps) => {
  if (history?.length === 0) {
    return (
      <div className="mr-8 prose">
        <p>
          <i className="fa-solid fa-info-circle fa-sm mr-3" />
          Lab does not use any images.
        </p>
      </div>
    );
  }

  return (
    <div className="mr-8">
      {history?.map((h, idx) => (
        <div>
          <div key={idx} className="text-gray-300 font-mono w-full h-8">
            {h.imageName}
          </div>
          {h.history.map((i, ix) => (
            <div key={ix} className="flex my-2 text-gray-300 font-mono text-sm border-b border-b-gray-500">
              <div className="w-8 h-8 bg-container flex items-center justify-center">{ix}</div>
              <div className="flex-1 flex items-center">{i.createdBy}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ImageInfo;
