package com.gapsi.proveedores.common;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.gapsi.proveedores.proveedor.ProveedorDuplicadoException;
import com.gapsi.proveedores.proveedor.ProveedorNotFoundException;
import com.gapsi.proveedores.proveedor.ProveedorSortFieldException;

/**
 * Converts application exceptions into RFC 9457 responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProveedorNotFoundException.class)
    public ProblemDetail handleNotFound(ProveedorNotFoundException exception) {
        return problem(HttpStatus.NOT_FOUND, "Proveedor no encontrado", exception.getMessage());
    }

    @ExceptionHandler(ProveedorDuplicadoException.class)
    public ProblemDetail handleConflict(ProveedorDuplicadoException exception) {
        return problem(HttpStatus.CONFLICT, "Proveedor duplicado", exception.getMessage());
    }

    @ExceptionHandler(PropertyReferenceException.class)
    public ProblemDetail handleInvalidPropertyReference(PropertyReferenceException exception) {
        return invalidSort(exception.getPropertyName());
    }

    @ExceptionHandler(ProveedorSortFieldException.class)
    public ProblemDetail handleInvalidSortField(ProveedorSortFieldException exception) {
        return invalidSort(exception.getProperty());
    }

    private static ProblemDetail invalidSort(String property) {
        return problem(HttpStatus.BAD_REQUEST, "Ordenamiento inválido",
                "El campo de orden '%s' no es válido. Campos permitidos: nombre, razonSocial y direccion."
                        .formatted(property));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException exception) {
        ProblemDetail problem = problem(HttpStatus.BAD_REQUEST, "Solicitud inválida",
                "Uno o más campos no cumplen las reglas de validación.");
        Map<String, String> errors = exception.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (firstMessage, ignored) -> firstMessage,
                        LinkedHashMap::new));
        problem.setProperty("errors", errors);
        return problem;
    }

    private static ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setTitle(title);
        return problem;
    }
}
