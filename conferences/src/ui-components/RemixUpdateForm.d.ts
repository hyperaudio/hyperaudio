/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Remix } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RemixUpdateFormInputValues = {
    url?: string;
    title?: string;
    description?: string;
    language?: string;
    tags?: string[];
    status?: string;
    metadata?: string;
};
export declare type RemixUpdateFormValidationValues = {
    url?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    language?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    metadata?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RemixUpdateFormOverridesProps = {
    RemixUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    url?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    language?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextAreaFieldProps>;
    metadata?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type RemixUpdateFormProps = React.PropsWithChildren<{
    overrides?: RemixUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    remix?: Remix;
    onSubmit?: (fields: RemixUpdateFormInputValues) => RemixUpdateFormInputValues;
    onSuccess?: (fields: RemixUpdateFormInputValues) => void;
    onError?: (fields: RemixUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RemixUpdateFormInputValues) => RemixUpdateFormInputValues;
    onValidate?: RemixUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RemixUpdateForm(props: RemixUpdateFormProps): React.ReactElement;
