import React, { useState } from 'react';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { TextInput } from '../forms/TextInput';
import { Card } from '../display/Card';
import { Button } from '../forms/Button';

export interface MetricGoalData {
  metricId: string;
  metricName: string;
  metricUnit: string;
  baseline?: number;
  target?: number;
  notes?: string;
}

export interface MetricGoalCardProps {
  metric: MetricGoalData;
  onUpdate: (metricId: string, updates: Partial<MetricGoalData>) => void;
  onRemove?: (metricId: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: (metricId: string) => void;
}

export const MetricGoalCard: React.FC<MetricGoalCardProps> = ({
  metric,
  onUpdate,
  onRemove,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [localBaseline, setLocalBaseline] = useState(metric.baseline?.toString() ?? '');
  const [localTarget, setLocalTarget] = useState(metric.target?.toString() ?? '');
  const [localNotes, setLocalNotes] = useState(metric.notes ?? '');

  const handleBaselineChange = (value: string) => {
    setLocalBaseline(value);
    const numValue = parseFloat(value);
    onUpdate(metric.metricId, { baseline: isNaN(numValue) ? undefined : numValue });
  };

  const handleTargetChange = (value: string) => {
    setLocalTarget(value);
    const numValue = parseFloat(value);
    onUpdate(metric.metricId, { target: isNaN(numValue) ? undefined : numValue });
  };

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    onUpdate(metric.metricId, { notes: value });
  };

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(metric.metricId);
    }
  };

  return (
    <Card 
      variant="default" 
      padding="l" 
      marginBottom="s"
      borderRadius="s"
      backgroundColor={isExpanded ? 'surface' : 'background'}
      borderWidth={isExpanded ? 1 : 0}
      borderColor={isExpanded ? 'primary' : 'transparent'}
    >
      {/* Minimal Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={isExpanded ? 'l' : undefined}
      >
        <Box flex={1}>
          <Text 
            variant="body" 
            color="text"
            marginBottom="xs"
          >
            {metric.metricName}
          </Text>
          <Text variant="caption" color="textMuted">
            {metric.metricUnit}
          </Text>
        </Box>

        <Box flexDirection="row" alignItems="center">
          {onToggleExpand && (
            <Button
              variant="ghost"
              size="small"
              onPress={handleToggleExpand}
            >
              <Text 
                variant="caption" 
                color="textSecondary"
              >
                {isExpanded ? '−' : '+'}
              </Text>
            </Button>
          )}
        </Box>
      </Box>

      {/* Minimalistic Expanded Content */}
      {isExpanded && (
        <Box>
          <Box flexDirection="row" marginBottom="l">
            <Box flex={1} marginRight="m">
              <TextInput
                label="Current"
                placeholder="0"
                value={localBaseline}
                onChangeText={handleBaselineChange}
                keyboardType="numeric"
                variant="outlined"
                containerProps={{ flex: 1 }}
              />
            </Box>
            
            <Box flex={1} marginLeft="m">
              <TextInput
                label="Target"
                placeholder="0"
                value={localTarget}
                onChangeText={handleTargetChange}
                keyboardType="numeric"
                variant="outlined"
                containerProps={{ flex: 1 }}
              />
            </Box>
          </Box>

          {/* Simple progress preview */}
          {metric.baseline !== undefined && metric.target !== undefined && (
            <Box
              backgroundColor="surface"
              padding="l"
              borderRadius="s"
              marginTop="m"
              borderWidth={1}
              borderColor="borderLight"
            >
              <Box 
                flexDirection="row" 
                alignItems="center" 
                justifyContent="space-between"
              >
                <Text variant="caption" color="textMuted">
                  {metric.baseline} → {metric.target} {metric.metricUnit}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
};

export default MetricGoalCard;
