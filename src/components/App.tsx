import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Code,
  Container,
  Heading,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import convert from 'npm-to-yarn';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ControlledRadioGroup from './ControlledRadioGroup';
import TextareaWithLabel from './TextareaWithLabel';

const STORAGE_KEY = 'conversion-type';

function App() {
  const [result, setResult] = useState('');
  const [isErrorInConversion, setIsErrorInConversion] = useState(false);

  const [storage, setStorage] = useState<Storage>();
  const toast = useToast();

  const { register, handleSubmit, setValue, control } = useForm<Inputs>();

  useEffect(() => {
    const conversionTypeInStorage = localStorage.getItem(STORAGE_KEY);

    if (
      conversionTypeInStorage === null ||
      !isConversionType(conversionTypeInStorage)
    ) {
      localStorage.setItem(STORAGE_KEY, 'npm');
    } else {
      setValue('conversionType', conversionTypeInStorage);
    }

    setStorage(storage);

    function isConversionType(string: any): string is ConversionType {
      const conversionTypes: ConversionType[] = [
        'npm',
        'yarn',
        'pnpm',
        'docusaurus',
      ];
      return conversionTypes.includes(string);
    }
  }, [setValue, storage]);

  const onSubmit = handleSubmit((data) => {
    let result = '';
    if (data.conversionType === 'docusaurus') {
      result = npmCommandToDocusaurusTabs(data.command);
    } else {
      result = convert(data.command, data.conversionType);
    }

    const isErrorMessageIncluded = result.includes(
      `# couldn't auto-convert command`
    );

    localStorage.setItem(STORAGE_KEY, data.conversionType);
    setIsErrorInConversion(isErrorMessageIncluded);
    setResult(result);
  });

  return (
    <Container py="5">
      <form onSubmit={onSubmit}>
        <Heading as="h1">npm CLI 명령어 변환기</Heading>
        <VStack py="5" spacing="5">
          <TextareaWithLabel
            labelText="npm CLI 명령어"
            register={register('command')}
          />
          <ControlledRadioGroup control={control} name="conversionType" />
          <Button colorScheme="blue" type="submit">
            변환
          </Button>
          <Box w="100%">
            <Text as="label" htmlFor="result">
              결과
            </Text>
            <Box mt="2">
              <Code as="pre" id="result" w="100%" p="5" variant="subtle">
                {result}
              </Code>
            </Box>
          </Box>
          {isErrorInConversion ? (
            <Alert status="warning">
              <AlertIcon />
              변환에 문제가 생겼습니다.
            </Alert>
          ) : null}
          <Button colorScheme="blue" onClick={handleCopyResult}>
            복사
          </Button>
        </VStack>
      </form>
    </Container>
  );

  function handleCopyResult() {
    navigator.clipboard.writeText(result).then(() => {
      toast({
        title: '복사되었습니다.',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    });
  }

  function npmCommandToDocusaurusTabs(npmCommand: string): string {
    let result = '';

    const yarnCommand = convert(npmCommand, 'yarn');
    const pnpmCommand = convert(npmCommand, 'pnpm');

    result = `<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>

\`\`\`sh
${npmCommand}
\`\`\`

  </TabItem>
  <TabItem value="yarn" label="Yarn">

\`\`\`sh
${yarnCommand}
\`\`\`

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

\`\`\`sh
${pnpmCommand}
\`\`\`

  </TabItem>
</Tabs>`;

    return result;
  }
}

interface Inputs {
  command: string;
  conversionType: ConversionType;
}

type ConversionType = 'npm' | 'yarn' | 'pnpm' | 'docusaurus';

export default App;
