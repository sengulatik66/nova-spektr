import { PropsWithChildren } from 'react';

import cnTw from '@renderer/shared/utils/twMerge';
import { IconNames } from '@renderer/components/ui/Icon/data';
import { Icon } from '@renderer/components/ui';
import { ViewClass } from '@renderer/components/ui-redesign/Buttons/common/constants';

type Props = {
  url: string;
  showIcon?: boolean;
  iconName?: IconNames;
  className?: string;
  tabIndex?: number;
};

const InfoLink = ({ url, showIcon, children, iconName = 'info', className, tabIndex }: PropsWithChildren<Props>) => (
  <a
    href={url}
    rel="noopener noreferrer"
    target="_blank"
    tabIndex={tabIndex}
    className={cnTw(
      ViewClass['text_primary'],
      'text-button-small font-semibold font-inter',
      showIcon && 'flex items-center gap-x-0.5',
      className,
    )}
  >
    {showIcon && <Icon name={iconName} size={16} />}
    {children}
  </a>
);

export default InfoLink;
