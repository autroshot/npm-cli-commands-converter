import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Code,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import convert from 'npm-to-yarn';
import { useState } from 'react';

function App() {
  const [result, setResult] = useState('');
  const [isErrorInConversion, setIsErrorInConversion] = useState(false);
  const toast = useToast();

  return (
    <Container py="5">
      <form onSubmit={handleSubmit}>
        <Heading as="h1">npm CLI 명령어 변환기</Heading>
        <VStack py="5" spacing="5">
          <FormControl>
            <FormLabel>npm CLI 명령어</FormLabel>
            <Textarea name="input" w="100%" />
          </FormControl>
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const target = e.target as any;
    const inputValue = target.input.value;

    const result = npmCommandToDocusaurusTabs(inputValue);

    const isErrorMessageIncluded = result.includes(
      `# couldn't auto-convert command`
    );

    setIsErrorInConversion(isErrorMessageIncluded);
    setResult(result);
  }

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

export default App;
