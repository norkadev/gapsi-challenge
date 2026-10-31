import {
	Avatar,
	Button,
	CircularProgress,
	Fade,
	Paper,
	Snackbar,
	Typography,
} from "@mui/material";
import candidateAvatar from "../../assets/candidato.webp";
import { useWelcomeInfo } from "./useWelcomeInfo";

interface WelcomePageProps {
	onContinue: () => void;
}

export function WelcomePage({ onContinue }: WelcomePageProps) {
	const { info, loading, error, retry } = useWelcomeInfo();

	return (
		<section className="welcome-layout" aria-labelledby="welcome-page-title">
			<Fade in timeout={350}>
				<Paper className="welcome-card" square elevation={0}>
					<div className="welcome-card__top">
						<span>e-Commerce Gapsi</span>
					</div>
					<div className="welcome-card__content">
						<Avatar
							className="candidate-avatar"
							src={candidateAvatar}
							alt="Imagen de perfil del candidato"
						/>
						{loading ? (
							<CircularProgress size={24} aria-label="Cargando información" />
						) : (
							<Typography color="text.secondary" sx={{ textAlign: "center" }}>
								{info?.message ?? "No se pudo cargar el mensaje de bienvenida."}
							</Typography>
						)}
						<Button
							variant="contained"
							onClick={onContinue}
							disabled={loading || !info}
						>
							Continuar
						</Button>
					</div>
					<div className="welcome-card__footer">
						<span>versión {info?.version ?? "—"}</span>
					</div>
				</Paper>
			</Fade>
			<Snackbar
				open={Boolean(error)}
				message={error?.message ?? ""}
				action={
					<Button color="inherit" size="small" onClick={retry}>
						Reintentar
					</Button>
				}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			/>
		</section>
	);
}
