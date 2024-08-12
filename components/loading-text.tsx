import { TypeAnimation } from 'react-type-animation';

interface LoadingTextProps {
  loadingText?: string;
  finishedText?: string;
  isLoading: boolean | null;
  finishedTextClassName?: string;
}

const LoadingText = ({ loadingText, finishedText, isLoading, finishedTextClassName }: LoadingTextProps) => {
  if (isLoading) {
    return <TypeAnimation sequence={[loadingText]} />;
  } else if (isLoading === null) {
    return null;
  }
  return <div className={finishedTextClassName}>{finishedText}</div>;
}

export default LoadingText;