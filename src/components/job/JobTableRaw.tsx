import { Flex, Text } from "@chakra-ui/layout";
import {
  Button,
  Image,
  Link,
  Show,
  Td,
  Tr,
  useMediaQuery,
  useQuery,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import NextLink from "next/link";
import type { FC } from "react";

import { useTranslate } from "../../context/TranslateProvider";
import type { Company } from "../../models/company";
import type { Job } from "../../models/job";
import { getJobKey } from "../../services/job.service";
import StyledTag from "../layout/StyledTag";

import JobCreatedFrom from "./JobCreatedFrom";

const breakpoint = "md";

interface Props {
  company: Company | undefined;
  job: Job;
  last: boolean;
  observe?: (element?: HTMLElement | null | undefined) => void;
}

const JobTableRaw: FC<Props> = ({ company, job, last, observe }) => {
  const { locale } = useTranslate();
  const query = useQuery({ above: breakpoint });
  const [showAll] = useMediaQuery(query);

  if (!company) return null;

  return (
    <NextLink href={`/${locale}/jobs/${getJobKey(job, company)}`}>
      <Tr
        _hover={{ backgroundColor: "gray.900" }}
        cursor="pointer"
        ref={observe && last ? observe : null}
      >
        <Td padding={2}>
          <Flex>
            <Image
              width={showAll ? "50px" : "35px"}
              maxHeight={showAll ? "50px" : "35px"}
              src={`/logos/${company.logo}`}
              alt={`${company.name} logo`}
              mr={1}
            />
            <div>
              <Text fontWeight="bold">{job.title}</Text>
              <Text fontSize="sm">{company.name}</Text>
              {job.compensation && (
                <Text fontSize="xs">
                  {job.compensation.currency || "$"}
                  {job.compensation.from}k - {job.compensation.currency || "$"}
                  {job.compensation.to}k{" "}
                </Text>
              )}
            </div>
          </Flex>
        </Td>
        <Td padding={2}>
          <Text fontSize="xs">{job.remote ? "Remote" : job.location}</Text>
        </Td>
        <Show above={breakpoint}>
          <Td padding={2}>
            {job.tags.map((tag) => (
              <StyledTag key={tag} value={tag} size="sm" />
            ))}
          </Td>
        </Show>
        <Td padding={2}>
          <JobCreatedFrom createdAt={dayjs(job.createdOn)} />
        </Td>
        <Show above={breakpoint}>
          <Td padding={2}>
            <Link isExternal href={job.applyLink}>
              <Button onClick={(event) => event.stopPropagation()}>
                Apply
              </Button>
            </Link>
          </Td>
        </Show>
      </Tr>
    </NextLink>
  );
};

export default JobTableRaw;
