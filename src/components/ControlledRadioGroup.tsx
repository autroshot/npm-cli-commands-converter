import { Box, Radio, RadioGroup, Stack, Tooltip } from '@chakra-ui/react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

export default function ControlledRadioGroup<T extends FieldValues>(
  props: UseControllerProps<T>
) {
  const { field } = useController(props);

  return (
    <RadioGroup {...field}>
      <Stack direction="row">
        <Radio value="npm">npm</Radio>
        <Radio value="yarn">yarn</Radio>
        <Radio value="pnpm">pnpm</Radio>
        <Tooltip placement="right" hasArrow label="도큐사우루스의 코드 블록 탭">
          <Box>
            <Radio value="docusaurus">Docusaurus</Radio>
          </Box>
        </Tooltip>
      </Stack>
    </RadioGroup>
  );
}
