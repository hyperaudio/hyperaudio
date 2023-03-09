/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SwitchField,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Media } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button
            size="small"
            variation="link"
            isDisabled={hasError}
            onClick={addItem}
          >
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function MediaCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    playbackId: "",
    url: "",
    poster: "",
    title: "",
    description: "",
    language: "",
    tags: [],
    private: false,
    status: "",
    metadata: "",
  };
  const [playbackId, setPlaybackId] = React.useState(initialValues.playbackId);
  const [url, setUrl] = React.useState(initialValues.url);
  const [poster, setPoster] = React.useState(initialValues.poster);
  const [title, setTitle] = React.useState(initialValues.title);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [language, setLanguage] = React.useState(initialValues.language);
  const [tags, setTags] = React.useState(initialValues.tags);
  const [private1, setPrivate1] = React.useState(initialValues.private);
  const [status, setStatus] = React.useState(initialValues.status);
  const [metadata, setMetadata] = React.useState(initialValues.metadata);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPlaybackId(initialValues.playbackId);
    setUrl(initialValues.url);
    setPoster(initialValues.poster);
    setTitle(initialValues.title);
    setDescription(initialValues.description);
    setLanguage(initialValues.language);
    setTags(initialValues.tags);
    setCurrentTagsValue("");
    setPrivate1(initialValues.private);
    setStatus(initialValues.status);
    setMetadata(initialValues.metadata);
    setErrors({});
  };
  const [currentTagsValue, setCurrentTagsValue] = React.useState("");
  const tagsRef = React.createRef();
  const validations = {
    playbackId: [],
    url: [{ type: "Required" }, { type: "URL" }],
    poster: [{ type: "URL" }],
    title: [{ type: "Required" }],
    description: [],
    language: [{ type: "Required" }],
    tags: [],
    private: [],
    status: [{ type: "JSON" }],
    metadata: [{ type: "JSON" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          playbackId,
          url,
          poster,
          title,
          description,
          language,
          tags,
          private: private1,
          status,
          metadata,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(new Media(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "MediaCreateForm")}
      {...rest}
    >
      <TextField
        label="Playback id"
        isRequired={false}
        isReadOnly={false}
        value={playbackId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId: value,
              url,
              poster,
              title,
              description,
              language,
              tags,
              private: private1,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.playbackId ?? value;
          }
          if (errors.playbackId?.hasError) {
            runValidationTasks("playbackId", value);
          }
          setPlaybackId(value);
        }}
        onBlur={() => runValidationTasks("playbackId", playbackId)}
        errorMessage={errors.playbackId?.errorMessage}
        hasError={errors.playbackId?.hasError}
        {...getOverrideProps(overrides, "playbackId")}
      ></TextField>
      <TextField
        label="Url"
        isRequired={true}
        isReadOnly={false}
        value={url}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId,
              url: value,
              poster,
              title,
              description,
              language,
              tags,
              private: private1,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.url ?? value;
          }
          if (errors.url?.hasError) {
            runValidationTasks("url", value);
          }
          setUrl(value);
        }}
        onBlur={() => runValidationTasks("url", url)}
        errorMessage={errors.url?.errorMessage}
        hasError={errors.url?.hasError}
        {...getOverrideProps(overrides, "url")}
      ></TextField>
      <TextField
        label="Poster"
        isRequired={false}
        isReadOnly={false}
        value={poster}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster: value,
              title,
              description,
              language,
              tags,
              private: private1,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.poster ?? value;
          }
          if (errors.poster?.hasError) {
            runValidationTasks("poster", value);
          }
          setPoster(value);
        }}
        onBlur={() => runValidationTasks("poster", poster)}
        errorMessage={errors.poster?.errorMessage}
        hasError={errors.poster?.hasError}
        {...getOverrideProps(overrides, "poster")}
      ></TextField>
      <TextField
        label="Title"
        isRequired={true}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster,
              title: value,
              description,
              language,
              tags,
              private: private1,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster,
              title,
              description: value,
              language,
              tags,
              private: private1,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Language"
        isRequired={true}
        isReadOnly={false}
        value={language}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster,
              title,
              description,
              language: value,
              tags,
              private: private1,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.language ?? value;
          }
          if (errors.language?.hasError) {
            runValidationTasks("language", value);
          }
          setLanguage(value);
        }}
        onBlur={() => runValidationTasks("language", language)}
        errorMessage={errors.language?.errorMessage}
        hasError={errors.language?.hasError}
        {...getOverrideProps(overrides, "language")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster,
              title,
              description,
              language,
              tags: values,
              private: private1,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            values = result?.tags ?? values;
          }
          setTags(values);
          setCurrentTagsValue("");
        }}
        currentFieldValue={currentTagsValue}
        label={"Tags"}
        items={tags}
        hasError={errors?.tags?.hasError}
        errorMessage={errors?.tags?.errorMessage}
        setFieldValue={setCurrentTagsValue}
        inputFieldRef={tagsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Tags"
          isRequired={false}
          isReadOnly={false}
          value={currentTagsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.tags?.hasError) {
              runValidationTasks("tags", value);
            }
            setCurrentTagsValue(value);
          }}
          onBlur={() => runValidationTasks("tags", currentTagsValue)}
          errorMessage={errors.tags?.errorMessage}
          hasError={errors.tags?.hasError}
          ref={tagsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "tags")}
        ></TextField>
      </ArrayField>
      <SwitchField
        label="Private"
        defaultChecked={false}
        isDisabled={false}
        isChecked={private1}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster,
              title,
              description,
              language,
              tags,
              private: value,
              status,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.private ?? value;
          }
          if (errors.private?.hasError) {
            runValidationTasks("private", value);
          }
          setPrivate1(value);
        }}
        onBlur={() => runValidationTasks("private", private1)}
        errorMessage={errors.private?.errorMessage}
        hasError={errors.private?.hasError}
        {...getOverrideProps(overrides, "private")}
      ></SwitchField>
      <TextAreaField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster,
              title,
              description,
              language,
              tags,
              private: private1,
              status: value,
              metadata,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextAreaField>
      <TextAreaField
        label="Metadata"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playbackId,
              url,
              poster,
              title,
              description,
              language,
              tags,
              private: private1,
              status,
              metadata: value,
            };
            const result = onChange(modelFields);
            value = result?.metadata ?? value;
          }
          if (errors.metadata?.hasError) {
            runValidationTasks("metadata", value);
          }
          setMetadata(value);
        }}
        onBlur={() => runValidationTasks("metadata", metadata)}
        errorMessage={errors.metadata?.errorMessage}
        hasError={errors.metadata?.hasError}
        {...getOverrideProps(overrides, "metadata")}
      ></TextAreaField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
