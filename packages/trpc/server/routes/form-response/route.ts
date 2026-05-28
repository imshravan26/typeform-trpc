import {
  formResponseInputModel,
  getFormResponseAnalyticsOutputModel,
  listFormResponsesOutputModel,
} from "./model";
import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formResponseService } from "../../services";

const TAGS = ["Form Responses"];
const getPath = generatePath("/form-responses");

export const formResponseRouter = router({
  listFormResponses: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listFormResponses"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(formResponseInputModel)
    .output(listFormResponsesOutputModel)
    .query(async ({ input, ctx }) => {
      const { form, fields, responses } = await formResponseService.listFormResponses({
        formId: input.formId,
        userId: ctx.user.id,
      }); 

      return {
        form,
        fields,
        responses,
      };
    }),

  getFormResponseAnalytics: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getFormResponseAnalytics"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(formResponseInputModel)
    .output(getFormResponseAnalyticsOutputModel)
    .query(async ({ input, ctx }) => {
      const { form, totalFields, totalResponses, latestResponseAt, fields, responses } =
        await formResponseService.getFormResponseAnalytics({
          formId: input.formId,
          userId: ctx.user.id,
        });

      return {
        form,
        totalFields,
        totalResponses,
        latestResponseAt,
        fields,
        responses,
      };
    }),
});
