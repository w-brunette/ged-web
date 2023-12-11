import { ThemeProvider } from "@emotion/react"
import { Box, Button, CssBaseline, Grid, TextField } from "@mui/material"
import { grey } from "@mui/material/colors"
import { useForm } from "react-hook-form"
import { Form, Link } from "react-router-dom"
import theme from "../../theme"


const LoginView = () => {
    const {
        handleSubmit, formState: { errors }, register
    } = useForm({})
    const onSubmit = () => {
        console.log('submit')
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container>
                <Grid item xs={6}>
                    <Box sx={{
                        width: '100%',
                        height: '100vh',
                        backgroundColor: grey[200],
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2} padding={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth variant="outlined" {...register('usuario', { required: 'form.errors.message' })}
                                        placeholder="Usuario"
                                        error={errors.usuario ? true : false}
                                        helperText={errors.usuario?.message} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth variant="outlined" {...register('senha', { required: 'form.errors.message' })}
                                        placeholder="Senha"
                                        error={errors.senha ? true : false}
                                        helperText={errors.senha?.message} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Grid item>
                                            <Button type="submit" color="primary" variant="contained">
                                                Login
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="text" LinkComponent={Link} sx={{ textDecoration: 'underline' }}>
                                                Esqueci minha senha
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                    </Box>
                </Grid>
            </Grid >
        </ThemeProvider>
    )
}

export { LoginView }
