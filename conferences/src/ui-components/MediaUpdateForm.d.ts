/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Media } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MediaUpdateFormInputValues = {
    playbackId?: string;
    url?: string;
    poster?: string;
    title?: string;
    description?: string;
    language?: string;
    tags?: string[];
    private?: boolean;
    status?: string;
    metadata?: string;
};
export declare type MediaUpdateFormValidationValues = {
    playbackId?: ValidationFunction<string>;
    url?: ValidationFunction<string>;
    poster?: ValidationFunction<string>;
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    language?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
    private?: ValidationFunction<boolean>;
    status?: ValidationFunction<string>;
    metadata?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MediaUpdateFormOverridesProps = {
    MediaUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    playbackId?: PrimitiveOverrideProps<TextFieldProps>;
    url?: PrimitiveOverrideProps<TextFieldProps>;
    poster?: PrimitiveOverrideProps<TextFieldProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    language?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
    private?: PrimitiveOverrideProps<SwitchFieldProps>;
    status?: PrimitiveOverrideProps<TextAreaFieldProps>;
    metadata?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type MediaUpdateFormProps = React.PropsWithChildren<{
    overrides?: MediaUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    media?: Media;
    onSubmit?: (fields: MediaUpdateFormInputValues) => MediaUpdateFormInputValues;
    onSuccess?: (fields: MediaUpdateFormInputValues) => void;
    onError?: (fields: MediaUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MediaUpdateFormInputValues) => MediaUpdateFormInputValues;
    onValidate?: MediaUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MediaUpdateForm(props: MediaUpdateFormProps): React.ReactElement;
