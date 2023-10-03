import { cc } from '@/utility/css';
import AnimateItems from './AnimateItems';

export default function HeaderList({
  title,
  icon,
  items,
}: {
  title: string,
  icon?: JSX.Element,
  items: JSX.Element[]
}) {
  return (
    <AnimateItems
      items={[
        <div key="header" className={cc(
          'text-gray-900',
          'dark:text-gray-100',
          'flex items-center mb-0.5',
          'uppercase',
        )}>
          {icon}
          {icon && <>&nbsp;</>}
          {title}
        </div>,
      ].concat(items)}
      classNameItem="text-gray-400 dark:text-gray-500"
    />
  );
}