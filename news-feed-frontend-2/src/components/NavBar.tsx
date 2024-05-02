import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const navigate = useNavigate()
  const handleNavBar = (route:string)=>{
     navigate(`${route}`)
  }
  return (
    <div style={navStyle}>
      <ul style={ulStyle}>
        <li>
          <Button onClick={()=>handleNavBar("/")} style={linkStyle}>
            <span style={textStyle}>News feed dapp</span>
          </Button>
        </li>
        <div style={divStyle}>
          <li>
            <Button onClick={()=>handleNavBar("/new-post")} style={linkStyle} >
              New Post
            </Button>
          </li>
          <li>
            <Button onClick={()=>handleNavBar("/users")} style={linkStyle}>
              Users
            </Button>
          </li>
          <li>
            <Button onClick={()=>handleNavBar("/")} style={linkStyle}>
              Feed
            </Button>
          </li>
        </div>
      </ul>
    </div>
  );
};

// Styles
const navStyle = {
  padding: '10px 20px',
  backgroundColor: '#333',
  
};

const ulStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const divStyle = {
  display: 'flex',
  gap: '20px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
};

const textStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
};

export default NavBar;
