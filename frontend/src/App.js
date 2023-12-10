import {
  ChakraProvider,
  CSSReset,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Container,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

function App() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/api/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Event created successfully');
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Box
        bgGradient="linear(to-br, #E6E6FA, #FFC0CB)"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
          bg="white"
          color="gray.800"
          mt={8}
          width="400px" // Set the width of the form container
        >
          <Heading as="h2" size="md" mb={6} textAlign={"center"}>
            EVENT SYNC HUB
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  {...register('title', { required: true })}
                  placeholder="Enter event title"
                  focusBorderColor="#FFC0CB"
                  fontSize="md"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Date</FormLabel>
                <Input {...register('date', { required: true })} type="date" fontSize="md" />
              </FormControl>
              <FormControl>
                <FormLabel>Time</FormLabel>
                <Input {...register('time', { required: true })} type="time" fontSize="md" />
              </FormControl>
              <FormControl>
                <FormLabel>Place</FormLabel>
                <Input
                  {...register('place', { required: true })}
                  placeholder="Enter event place"
                  focusBorderColor="#FFC0CB"
                  fontSize="md"
                />
              </FormControl>
              <Button colorScheme="pink" type="submit" mt={4} w="100%">
                Create Event
              </Button>
            </Stack>
          </form>
        </Box>
        
      </Box>
    </ChakraProvider>
  );
}

export default App;
