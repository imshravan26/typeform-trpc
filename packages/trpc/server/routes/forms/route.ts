import {
  createFieldInputModel,
  createFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  createFormSubmissionInputModel,
  createFormSubmissionOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  deleteFormSubmissionInputModel,
  deleteFormSubmissionOutputModel,
  getFieldInputModel,
  getFieldOutputModel,
  getFormSubmissionInputModel,
  getFormSubmissionOutputModel,
  getFormWithFieldsInputModel,
  getFormWithFieldsOutputModel,
  listFieldsInputModel,
  listFieldsOutputModel,
  listFormSubmissionsInputModel,
  listFormSubmissionsOutputModel,
  listFormsInputModel,
  listFormsOutputModel,
  updateFieldInputModel,
  updateFieldOutputModel,
} from "./model";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;

      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });

      return {
        id,
      };
    }),

  listForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFormsInputModel)
    .output(listFormsOutputModel)
    .query(async ({ ctx }) => {
      const { forms } = await formService.listFormsByUserId({
        userId: ctx.user.id,
      });

      return {
        forms,
      };
    }),

  getFormWithFields: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormWithFields"),
        tags: TAGS,
      },
    })
    .input(getFormWithFieldsInputModel)
    .output(getFormWithFieldsOutputModel)
    .query(async ({ input }) => {
      const { form } = await formService.getFormWithFields(input);

      return {
        form,
      };
    }),

  createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formService.createField(input);

      return {
        id,
      };
    }),

  getField: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFieldInputModel)
    .output(getFieldOutputModel)
    .query(async ({ input }) => {
      const { field } = await formService.getField(input);

      return {
        field,
      };
    }),

  listFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listFields"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFieldsInputModel)
    .output(listFieldsOutputModel)
    .query(async ({ input }) => {
      const { fields } = await formService.listFieldsByFormId(input);

      return {
        fields,
      };
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFieldInputModel)
    .output(updateFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formService.updateField(input);

      return {
        id,
      };
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formService.deleteField(input);

      return {
        id,
      };
    }),

  createFormSubmission: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createFormSubmission"),
        tags: TAGS,
      },
    })
    .input(createFormSubmissionInputModel)
    .output(createFormSubmissionOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formService.createFormSubmission(input);

      return {
        id,
      };
    }),

  getFormSubmission: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormSubmission"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getFormSubmissionInputModel)
    .output(getFormSubmissionOutputModel)
    .query(async ({ input }) => {
      const { submission } = await formService.getFormSubmission(input);

      return {
        submission,
      };
    }),

  listFormSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listFormSubmissions"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFormSubmissionsInputModel)
    .output(listFormSubmissionsOutputModel)
    .query(async ({ input }) => {
      const { submissions } = await formService.listFormSubmissionsByFormId(input);

      return {
        submissions,
      };
    }),

  deleteFormSubmission: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteFormSubmission"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFormSubmissionInputModel)
    .output(deleteFormSubmissionOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formService.deleteFormSubmission(input);

      return {
        id,
      };
    }),
});
