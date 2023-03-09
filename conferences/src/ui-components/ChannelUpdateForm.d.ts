/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Channel } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ChannelUpdateFormInputValues = {
    name?: string;
    description?: string;
    tags?: string[];
    metadata?: string;
};
export declare type ChannelUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
    metadata?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ChannelUpdateFormOverridesProps = {
    ChannelUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
    metadata?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ChannelUpdateFormProps = React.PropsWithChildren<{
    overrides?: ChannelUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    channel?: Channel;
    onSubmit?: (fields: ChannelUpdateFormInputValues) => ChannelUpdateFormInputValues;
    onSuccess?: (fields: ChannelUpdateFormInputValues) => void;
    onError?: (fields: ChannelUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ChannelUpdateFormInputValues) => ChannelUpdateFormInputValues;
    onValidate?: ChannelUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ChannelUpdateForm(props: ChannelUpdateFormProps): React.ReactElement;
