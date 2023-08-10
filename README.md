# npm CLI 명령어 변환기

npm CLI 명령어를 다른 패키지 관리자(yarn, pnpm)의 명령어 및 도큐사우루스의 탭 컴포넌트로 변환하는 웹사이트입니다.

변환 로직은 [npm-to-yarn 패키지](https://github.com/nebrelbug/npm-to-yarn)를 이용합니다.

## 실행 방법

```bash
# npm
npm start
# yarn
yarn start
```

앱을 개발 모드에서 실행합니다. [http://localhost:3000](http://localhost:3000)에서 앱이 실행되는 것을 확인하세요.

## 고민

폼 라이브러리 [React Hook Form](https://react-hook-form.com/)과 CSS 라이브러리 [Chakra UI](https://chakra-ui.com/)를 사용하면서 생겼던 고민과 그 결과입니다.

### `register`를 프롭으로 받는 컴포넌트

컴포넌트 내부에서 'React Hook Form'을 사용하며 폼의 `register`를 프롭으로 받고 싶다면 다음과 같이 작성할 수 있습니다. `register`의 타입으로는 'React Hook Form'에서 제공하는 `UseFormRegisterReturn`를 사용합니다.

```tsx
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
```

### 비제어 컴포넌트 제어하기

'Chakra UI'의 라디오 컴포넌트는 'React Hook Form'의 `register`를 사용하여 등록하려 하면 타입스크립트 오류가 발생합니다. 대신 `Controller`를 사용할 수 있습니다.

```tsx
import { Box, Radio, RadioGroup, Stack, Tooltip } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';

export default function App() {
  const { control } = useForm<Inputs>();

  return (
  	<Controller
      control={control}
      name="conversionType"
      render={({ field }) => (
        <RadioGroup {...field}>
          <Stack direction="row">
            <Radio value="npm">npm</Radio>
            <Radio value="yarn">yarn</Radio>
            <Radio value="pnpm">pnpm</Radio>
            <Tooltip
              placement="right"
              hasArrow
              label="도큐사우루스의 코드 블록 탭"
            >
              <Box>
                <Radio value="docusaurus">Docusaurus</Radio>
                </Box>
            </Tooltip>
          </Stack>
        </RadioGroup>
      )}
    />
  );
}

interface Inputs {...}
```

또는 `useController`를 사용하여 별도의 컴포넌트로 만들 수도 있습니다.

```tsx
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
```

'React Hook Form'의 공식 문서에 있는 [예시](https://codesandbox.io/s/usecontroller-0o8px)는 특정 폼에 의존하는데 위의 컴포넌트는 제네릭 `T`를 사용하여 특정 폼에 제한되지 않습니다.

사용 방법은 공식 문서의 예시와 동일합니다.

```tsx
import { useForm } from "react-hook-form";
import ControlledRadioGroup from './ControlledRadioGroup';

export default function App() {
  const { control } = useForm<Inputs>();
  
  return (
    <form>
      <ControlledRadioGroup control={control} name="FirstName" rules={{ required: true }} />
      <input type="submit" />
    </form>
  );
}

interface Inputs {...}
```

`control`을 먼저 작성했을 때의 `name` 자동 완성도 제대로 동작합니다.
