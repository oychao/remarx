import ReactEcharts from 'echarts-for-react';
import * as React from 'react';
import { DependencyGraphModel } from '../DependencyGraph.model';
import './DependencyGraphNetwork.css';

interface IDependencyGraphNetworkProps {}

export const DependencyGraphNetwork: React.FunctionComponent<
  IDependencyGraphNetworkProps
> = props => {
  const { graphModule } = DependencyGraphModel.useContainer();

  return (
    <div className={'DependencyGraphNetwork'}>
      <ReactEcharts
        style={{ height: '100%', width: '100%' }}
        option={{
          title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right',
          },
          tooltip: {},
          legend: [
            {
              // selectedMode: 'single',
              data: graphModule.cates.map(function (a: any) {
                return a.name;
              }),
            },
          ],
          animationDuration: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              name: 'Les Miserables',
              type: 'graph',
              layout: 'circular',
              circular: {
                rotateLabel: true,
              },
              data: graphModule.nodes,
              links: graphModule.edges,
              categories: graphModule.cates,
              roam: true,
              label: {
                position: 'right',
                formatter: '{b}',
              },
              lineStyle: {
                color: 'source',
                curveness: 0.3,
              },
              emphasis: {
                focus: 'adjacency',
                lineStyle: {
                  width: 10,
                },
              },
            },
          ],
        }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};
