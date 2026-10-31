import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Snackbar,
	Stack,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProveedorForm } from "./ProveedorForm";
import { ProveedorList } from "./ProveedorList";
import { getAllProveedores } from "./proveedoresApi";
import type { Proveedor } from "./proveedor.types";
import { useProveedores } from "./useProveedores";
import { normalizeApiError } from "../../shared/api/httpClient";

export function ProveedoresPage() {
	const {
		proveedores,
		totalElements,
		initialLoading,
		loadingMore,
		hasMore,
		error,
		loadNextPage,
		retry,
		addProveedor,
		removeProveedor,
		dismissError,
	} = useProveedores();
	const [formOpen, setFormOpen] = useState(false);
	const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(
		null,
	);
	const [deleting, setDeleting] = useState(false);
	const [notice, setNotice] = useState("");
	const [noticeSeverity, setNoticeSeverity] = useState<"success" | "error">(
		"success",
	);
	const [printRows, setPrintRows] = useState<Proveedor[] | null>(null);
	const [preparingPrint, setPreparingPrint] = useState(false);

	useEffect(() => {
		if (printRows === null) return;

		const finishPrinting = () => {
			setPrintRows(null);
			setPreparingPrint(false);
		};
		const frame = window.requestAnimationFrame(() => window.print());
		window.addEventListener("afterprint", finishPrinting);

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("afterprint", finishPrinting);
		};
	}, [printRows]);

	const handleCreate = async (request: Parameters<typeof addProveedor>[0]) => {
		await addProveedor(request);
		setNoticeSeverity("success");
		setNotice("El proveedor se agregó correctamente.");
	};

	const handleDelete = async () => {
		if (!selectedProveedor) return;
		setDeleting(true);
		try {
			await removeProveedor(selectedProveedor.id);
			setNoticeSeverity("success");
			setNotice("El proveedor se eliminó correctamente.");
			setSelectedProveedor(null);
		} catch (deleteError: unknown) {
			setNoticeSeverity("error");
			setNotice(
				deleteError instanceof Error
					? deleteError.message
					: "No se pudo eliminar el proveedor.",
			);
		} finally {
			setDeleting(false);
		}
	};

	const handlePrint = async () => {
		if (preparingPrint) return;
		setPreparingPrint(true);
		try {
			const allProveedores = await getAllProveedores();
			setPrintRows(allProveedores);
		} catch (printError: unknown) {
			setNoticeSeverity("error");
			setNotice(normalizeApiError(printError).message);
			setPreparingPrint(false);
		}
	};

	return (
		<section aria-labelledby="providers-page-title">
			<Box
				className="app-page-title"
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					mb: 2,
					gap: 2,
				}}
			>
				<Typography
					id="providers-page-title"
					component="h1"
					variant="h1"
					color="text.secondary"
				>
					Administración de Proveedores
				</Typography>
			</Box>

			<Box className="providers-panel">
				<div className="providers-toolbar">
					<Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
						<GroupsRoundedIcon color="primary" sx={{ fontSize: 34 }} />
					</Stack>
					<div className="providers-toolbar__actions">
						<Button
							startIcon={<AddCircleRoundedIcon />}
							onClick={() => setFormOpen(true)}
						>
							Agregar elemento
						</Button>
						<Button
							color="secondary"
							startIcon={<PrintRoundedIcon />}
							onClick={() => void handlePrint()}
							disabled={preparingPrint}
						>
							{preparingPrint
								? "Preparando impresión…"
								: "Imprimir elementos"}
						</Button>
					</div>
				</div>

				<ProveedorList
					proveedores={proveedores}
					initialLoading={initialLoading}
					loadingMore={loadingMore}
					hasMore={hasMore}
					onLoadMore={loadNextPage}
					onDelete={setSelectedProveedor}
				/>
				<div className="providers-footer" aria-live="polite">
					{loadingMore ? (
						<span>Cargando más proveedores…</span>
					) : (
						<span>
							Mostrando {proveedores.length} de {totalElements} proveedores
						</span>
					)}
				</div>
			</Box>

			{printRows !== null && (
				<table className="provider-print-table">
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Razón social</th>
							<th>Dirección</th>
						</tr>
					</thead>
					<tbody>
						{printRows.map((proveedor) => (
							<tr key={proveedor.id}>
								<td>{proveedor.nombre}</td>
								<td>{proveedor.razonSocial}</td>
								<td>{proveedor.direccion}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<ProveedorForm
				open={formOpen}
				onClose={() => setFormOpen(false)}
				onCreate={handleCreate}
				onError={(message) => {
					setNoticeSeverity("error");
					setNotice(message);
				}}
			/>

			<Dialog
				open={Boolean(selectedProveedor)}
				onClose={() => !deleting && setSelectedProveedor(null)}
				aria-labelledby="delete-provider-title"
			>
				<DialogTitle id="delete-provider-title">Eliminar proveedor</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Deseas eliminar a {selectedProveedor?.nombre}? Esta acción no se
						puede deshacer.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setSelectedProveedor(null)}
						disabled={deleting}
					>
						Cancelar
					</Button>
					<Button
						color="secondary"
						variant="contained"
						onClick={() => void handleDelete()}
						disabled={deleting}
					>
						{deleting ? "Eliminando…" : "Eliminar"}
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={Boolean(error || notice)}
				autoHideDuration={5000}
				onClose={() => {
					setNotice("");
					setNoticeSeverity("success");
					dismissError();
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					action={
						error ? (
							<Button color="inherit" size="small" onClick={() => void retry()}>
								Reintentar
							</Button>
						) : undefined
					}
					onClose={() => {
						setNotice("");
						setNoticeSeverity("success");
						dismissError();
					}}
					severity={error ? "error" : noticeSeverity}
					variant="filled"
					sx={{ width: "100%" }}
				>
					{error?.message ?? notice}
				</Alert>
			</Snackbar>
		</section>
	);
}
