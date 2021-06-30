import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import useOutsideClick from 'src/hooks/useClickOutside';
import styled from 'styled-components';
import SlippageControl from './SlippageControl';

const ButtonSettings: React.FC = () => {
  const [showed, setShowed] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => hide());

  const toggle = () => {
    setShowed(!showed);
  };

  const hide = () => {
    setShowed(false);
  };

  return (
    <StyledDropdown ref={ref}>
      <button className="btn btn-icon btn-icon-highlight ml-1" onClick={toggle}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      {showed && (
        <StyledDropdownContent>
          <SlippageControl />
        </StyledDropdownContent>
      )}
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledDropdownContent = styled.div`
  min-width: 9rem;
  background-color: ${(p) => p.theme.color.white};
  border: solid 3px ${(p) => p.theme.color.primary.main};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2.6rem;
  right: 0rem;
  z-index: 100;
`;

export default ButtonSettings;
