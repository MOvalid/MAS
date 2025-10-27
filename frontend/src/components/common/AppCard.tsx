import { Card } from 'react-native-paper';
import { useAppTheme } from '../../theme/AppThemeContext';
import { Spacing, Radius } from '../../theme/metrics';

type AppCardProps = React.ComponentProps<typeof Card> & {
  marginTop?: Spacing;
  padding?: Spacing;
  borderRadius?: Radius;
};

export const AppCard: React.FC<AppCardProps> = ({
  style,
  marginTop = 'md',
  padding = 'md',
  borderRadius = 'md',
  ...props
}) => {
  const { metrics } = useAppTheme();

  return (
    <Card
      {...props}
      style={[
        {
          marginTop: metrics.spacing[marginTop],
          padding: metrics.spacing[padding],
          borderRadius: metrics.radius[borderRadius],
        },
        style,
      ]}
    />
  );
};
