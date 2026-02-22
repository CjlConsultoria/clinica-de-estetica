import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  padding: 60px 40px;
  text-align: center;
`;

export const IconWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: #fdf0e8;
  border: 2px solid #f0ebe4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #BBA188;
`;

export const Title = styled.h2`
  font-size: 1.3rem;
  font-family: var(--font-cabourg-bold), 'Cabourg', serif;
  color: #1a1a1a;
  margin: 0 0 10px;
  font-weight: 700;
`;

export const Description = styled.p`
  font-size: 0.88rem;
  color: #999;
  margin: 0 0 28px;
  max-width: 340px;
  line-height: 1.6;
`;

export const RoleBadge = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  letter-spacing: 0.3px;
`;