import { useState, useEffect } from "react";
import { Box, Heading, Text, VStack, HStack, Link, Input, Textarea, Button, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const API_URL = "https://kvdb.io/N7cmQg1DwZbADh2Hu3NncF/";
const API_KEY = "legal";

const Index = () => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const res = await fetch(`${API_URL}`, {
      headers: {
        Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
      },
    });
    const keys = await res.json();
    const resourcesData = await Promise.all(
      keys.map(async (key) => {
        const res = await fetch(`${API_URL}${key}`, {
          headers: {
            Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
          },
        });
        return res.json();
      }),
    );
    setResources(resourcesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, url }),
    });
    if (res.ok) {
      toast({
        title: "Resource added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTitle("");
      setDescription("");
      setUrl("");
      fetchResources();
    }
  };

  const handleDelete = async (key) => {
    await fetch(`${API_URL}${key}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
      },
    });
    toast({
      title: "Resource deleted.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    fetchResources();
  };

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Heading mb={8} textAlign="center">
        Recursive Legal
      </Heading>
      <VStack spacing={8} align="stretch">
        {resources.map((resource) => (
          <Box key={resource.key} p={4} shadow="md" borderWidth="1px">
            <Heading as="h3" size="md" mb={2}>
              {resource.title}
            </Heading>
            <Text mb={2}>{resource.description}</Text>
            <HStack>
              <Link href={resource.url} isExternal>
                View Resource
              </Link>
              <IconButton icon={<FaTrash />} aria-label="Delete resource" onClick={() => handleDelete(resource.key)} />
            </HStack>
          </Box>
        ))}
      </VStack>
      <Box as="form" onSubmit={handleSubmit} mt={8}>
        <Heading as="h2" size="lg" mb={4}>
          Add Resource
        </Heading>
        <VStack spacing={4}>
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
            Add Resource
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Index;
