import React, { useState } from "react";
import { fetchWithCSRFToken } from "../utils/fetch";
import TextareaAutosize from 'react-textarea-autosize';

const NodeForm = ({ id, title, body, onSuccess, setShowAdminOptions, showAdminOptions, showNodeAdd, setShowNodeAdd }) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const [result, setResult] = useState({
    success: null,
    error: null,
    message: '',
  });

  const defaultValues = {
    title: title ? title : '',
    body: body ? body.value : '',
    summary: body ? body.summary : '',
  };
  const [values, setValues] = useState(defaultValues);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    setSubmitting(true);
    event.preventDefault();

    const csrfUrl = `/session/token?_format=json`;
    const fetchUrl = id ? `/jsonapi/node/page/${id}` : `/jsonapi/node/page`;

    // @TODO: Add validation for fields.
    //        Do I need this const if form validation.
    let data = {
      "data": {
        "type": "node--page",
        "attributes": {
          "title": `${values.title}`,
          "body": {
            "value": `${values.body}`,
            "format": 'plain_text',
            "summary": `${values.summary}`,
          }
        }
      }
    };

    // If we have an ID that means we're editing an existing node and not
    // creating a new one.
    if (id) {
      // Set the ID in the data we'll send to the API.
      data.data.id = id;
    }

    const fetchOptions = {
      // Use HTTP PATCH for edits, and HTTP POST to create new pages.
      method: id ? 'PATCH' : 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Cache': 'no-cache'
      }),
      body: JSON.stringify(data),
    };

    try {
      fetchWithCSRFToken(csrfUrl, fetchUrl, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
          // We're done processing.
          setSubmitting(false);

          // If there are any errors display the error and return early.
          if (data.errors && data.errors.length > 0) {
            setResult({
              success: false,
              error: true,
              message: <div class="alert alert-danger d-flex" role="alert"><div class="ml-3 mt-1">{data.errors[0].title}.<br />{data.errors[0].detail}</div><button type="button" class="close ml-auto align-self-start" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div >,
            });
            return false;
          }

          // If the request was successful, remove existing form values and
          // display a success message.
          setValues(defaultValues);
          if (data.data.id) {
            setResult({
              success: true,
              message: <div class="alert alert-success d-flex" role="alert"><div class="ml-3 mt-1">{(id ? 'Updated' : 'Added')}: {data.data.attributes.title}</div><button type="button" class="close ml-auto align-self-start" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div >,
            });

            if (typeof onSuccess === 'function') {
              onSuccess(data.data);
              setShowAdminOptions ? setShowAdminOptions(!showAdminOptions) : '';
              setShowNodeAdd(!showNodeAdd);
            }
          }
        });
    } catch (error) {
      console.log('Error while contacting API', error);
      setSubmitting(false);
    }
  };

  // If the form is currently being processed display a spinner.
  if (isSubmitting) {
    return (
      <div class="loader">
        Processing ...
      </div>
    )
  }


  return (
    <div>
      {(result.success || result.error) &&
        <div>
        {/* <h4 class={(result.success ? 'text-success' : 'text-danger')}>{(result.success ? 'Success!' : 'Error')}</h4> */}
          {result.message}
        </div>
      }
      {(!result.success &&

      <form class={id ? 'form--live-edit' : 'form'} onSubmit={handleSubmit}>

        <label for="title">Title</label>
        <TextareaAutosize
          class={id ? 'h5' : 'form-control'}
          name="title"
          rows="4"
          cols="30"
          value={values.title}
          placeholder="Add a title"
          autoFocus
          onChange={handleInputChange}
        />

        <label for="summary">Summary</label>
        <TextareaAutosize
          class={id ? 'body' : 'form-control'}
          name="summary"
          rows="4"
          cols="30"
          value={values.summary}
          placeholder="Add a summary"
          onChange={handleInputChange}
        />

        { !id &&
        <>
        <label for="body">Body</label>
        <TextareaAutosize
          class={id ? 'body' : 'form-control'}
          name="body"
          rows="4"
          cols="30"
          value={values.body}
          placeholder="Add a body"
          onChange={handleInputChange}
        />
        </>
        }

        <input
          class="btn btn-success mt-3"
          name="submit"
          type="submit"
          value={id ? 'Save changes' : 'Save'}
        />

      </form>
      )}
    </div>
  )
};

export default NodeForm;
