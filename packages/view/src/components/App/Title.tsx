import * as React from 'react';

interface TitleProps {
  title: string;
}

export class Title extends React.Component<TitleProps> {
  constructor(props: TitleProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <span>{this.props.title}</span>;
  }
}
