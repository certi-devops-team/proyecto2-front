import { AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme, } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface NavBarProps {
  onMenuClick: () => void;
}

export default function NavBar({ onMenuClick }: NavBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" noWrap component="div">
          Casa de Cambios Bolivia
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
