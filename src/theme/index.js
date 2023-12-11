import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme } from "@mui/material";
import { amber, blue, grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: blue[900],
      contrastText: "#FFF",
    },
    custom: {
      main: grey[300],
      contrastText: "#FFF",
    },
    modulo: {
      header: grey[200],
      content: grey[200]
    }
  },

  components: {
    MuiInput: {
      inputProps: {
        style: {
          textTransform: 'uppercase'
        }
      },
      defaultProps: {
        size: "small"
      }
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'small'
      }
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'small'
      }
    },
    MuiButtonGroup: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
        color: 'primary'
      }
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
        variant: 'filled',
        sx: {
          borderRadius: 1
        }
      }
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#FAFAFA',
          padding: '10px',
          border: '1px solid #AAA',
          color: '#888',
          fontSize: '0.9em'
        }
      },
      defaultProps: {
        variant: 'dense',
      },
    }

  },

})

export default theme