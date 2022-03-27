interface AuthorBioProps {
  author: {
    name: string;
    photo: string;
    bio: string;
    social: {
      twitter: string;
      linkedin: string;
    };
  };
}

const AuthorBio = ({ author }: AuthorBioProps) => {
  return (
    <div className="prose max-w-none px-4 flex flex-col">
      <div className="flex items-center">
        <img className="object-cover w-16 h-16 rounded-full border-green border-2" src={author.photo} alt="" />
        <span className="ml-2">{author.name}</span>
      </div>
      <div className="text-sm leading-6">{author.bio}</div>
      <div className="flex not-prose text-lg mt-4 gap-3">
        {author.social.twitter && (
          <a href={`https://twitter.com/${author.social.twitter}`}>
            <i className="fa-brands fa-twitter" />
          </a>
        )}
        {author.social.linkedin && (
          <a href={`https://www.linkedin.com/in/${author.social.linkedin}/`}>
            <i className="fa-brands fa-linkedin" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AuthorBio;
