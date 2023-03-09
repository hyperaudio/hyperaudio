/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RemixCreateFormInputValues = {
    url?: string;
    title?: string;
    description?: string;
    language?: string;
    tags?: string[];
    status?: string;
    metadata?: string;
};
export declare type RemixCreateFormValidationValues = {
    url?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    language?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    metadata?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RemixCreateFormOverridesProps = {
    RemixCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    url?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    language?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextAreaFieldProps>;
    metadata?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type RemixCreateFormProps = React.PropsWithChildren<{
    overrides?: RemixCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RemixCreateFormInputValues) => RemixCreateFormInputValues;
    onSuccess?: (fields: RemixCreateFormInputValues) => void;
    onError?: (fields: RemixCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RemixCreateFormInputValues) => RemixCreateFormInputValues;
    onValidate?: RemixCreateFormValidationValues;
} & React.CSSProperties>;
export default function RemixCreateForm(props: RemixCreateFormProps): React.ReactElement;
