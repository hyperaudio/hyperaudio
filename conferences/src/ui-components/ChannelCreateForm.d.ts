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
export declare type ChannelCreateFormInputValues = {
    name?: string;
    description?: string;
    tags?: string[];
    metadata?: string;
};
export declare type ChannelCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
    metadata?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ChannelCreateFormOverridesProps = {
    ChannelCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
    metadata?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ChannelCreateFormProps = React.PropsWithChildren<{
    overrides?: ChannelCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ChannelCreateFormInputValues) => ChannelCreateFormInputValues;
    onSuccess?: (fields: ChannelCreateFormInputValues) => void;
    onError?: (fields: ChannelCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ChannelCreateFormInputValues) => ChannelCreateFormInputValues;
    onValidate?: ChannelCreateFormValidationValues;
} & React.CSSProperties>;
export default function ChannelCreateForm(props: ChannelCreateFormProps): React.ReactElement;
