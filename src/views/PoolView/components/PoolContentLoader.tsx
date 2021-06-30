import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Card from 'src/components/Card';
import { FormRowContentLoader, SubmitButtonContentLoader } from 'src/components/ContentLoader';
import { FormSeparator } from 'src/components/Form';
import { useTheme } from 'styled-components';

export const PoolContentLoader: React.FC = () => {
  const theme = useTheme();
  return (
    <>
      <Card border={'none'}>
        <FormRowContentLoader />
        <FormSeparator>
          <FontAwesomeIcon icon={faArrowDown} color={theme.color.primary.light} />
        </FormSeparator>
        <FormRowContentLoader />
        <SubmitButtonContentLoader />
      </Card>
    </>
  );
};
