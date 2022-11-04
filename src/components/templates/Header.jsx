import styled from "styled-components";
import SearchIcon from "@components/atoms/SearchIcon";
import Logo from "@components/atoms/Logo";
import HamburgerIcon from "@components/atoms/HamburgerIcon";
import * as colors from "@styles/colors";
import kaikasImgUrl from "@assets/image/kaikas.png";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import Wallet from "@components/atoms/Wallet";

const Container = styled.header`
  width: 100%;
  height: 64px;
  background-color: ${colors.bgBlack};
  position: fixed;
  top: 0px;
  display: flex;
  padding: 0px 16px;
  align-items: center;
  z-index: 999;
`;

const LogoWrapper = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

const SearchBarWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
  border-left-width: 1px;
  border-color: hsla(0, 0%, 100%, 0.12);
  border-style: solid;
`;

const GrayRoundBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${colors.bgSecondary};
  cursor: pointer;
`;

const WalletBox = styled(GrayRoundBox)`
  background-color: ${colors.textYellow};
  margin-right: 8px;
`;

const SearchIconWrapper = styled.div`
  margin-left: 16px;
`;

const KaikasImage = styled.img`
  width: 20px;
  height: 20px;
`;
async function isKaikasAvailable() {
  const klaytn = window?.klaytn;
  if (!klaytn) {
    return false;
  }

  const results = await Promise.all([
    klaytn._kaikas.isApproved(),
    klaytn._kaikas.isEnabled(),
    klaytn._kaikas.isUnlocked(),
  ]);

  return results.every((res) => res);
}

const klaytn = window.klaytn;

function Header() {
  const { user, setUser } = useAuth();
  async function loginWithKaikas() {
    if (!klaytn) {
      toast.error("kaikas 설치되었는 지 확인해주세요.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      //[0x2asdfsggg]
      const accounts = await toast.promise(
        klaytn.enable(),
        { pending: "Kaikas 지갑 연동 중" },
        { closeButton: true }
      );
      setUser(accounts[0]);
      toast.success(`${accounts[0].slice(0, 13)}...님 환영합니다 ^^`);
    } catch {
      toast.error("로그인에 실패하셨습니다. 다시 시도해주세요 !");
    }

    // 로그인 로직
  }

  function handleLogin() {
    loginWithKaikas();
  }

  async function handleDone() {
    const isAvailable = await isKaikasAvailable();
    if (isAvailable) {
      toast.success("이미 로그인이 되어 있습니다.");
      return;
    }

    toast.warn("다시 로그인 해주세요.");
    setUser("");
  }

  return (
    <Container>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <SearchBarWrapper>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
      </SearchBarWrapper>
      <WalletBox onClick={user ? handleDone : handleLogin}>
        {user ? <KaikasImage src={kaikasImgUrl} /> : <Wallet />}
      </WalletBox>
      <GrayRoundBox>
        <HamburgerIcon />
      </GrayRoundBox>
    </Container>
  );
}

export default Header;
