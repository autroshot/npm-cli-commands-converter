import { FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import { UseFormRegisterReturn } from 'react-hook-form';

export default function TextareaWithLabel({ labelText, register }: Props) {
  return (
    <FormControl>
      <FormLabel>{labelText}</FormLabel>
      <Textarea w="100%" {...register} />
    </FormControl>
  );
}

interface Props {
  labelText: string;
  register: UseFormRegisterReturn;
}
