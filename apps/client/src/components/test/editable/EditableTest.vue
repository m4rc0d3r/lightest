<template>
  <form class="test" @submit.prevent>
    <div class="title">
      <label for="">Title</label>
      <input type="text" v-model="test.title" />
    </div>
    <!-- <input class="title" type="text" placeholder="Title" v-model="test.title" /> -->
    <EditableQuestionBlock
      :questions="test.questions"
      @add-question="test.addQuestion.call(test)"
      @change-question-type="
        (questionIndex, type) =>
          test.changeQuestionType.call(test, questionIndex, type)
      "
      @delete-question="
        (questionIndex) => test.deleteQuestion.call(test, questionIndex)
      "
    />
    <button v-if="mode === creationMode" @click="create">Create</button>
    <button v-else @click="update">Save</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import EditableQuestionBlock from "./EditableQuestionBlock.vue";

import { useNotificationStore } from "@/stores/notification";
import { Notification, Status } from "@/models/notification";
import { QuestionType } from "@/models/test/base";
import {
  AnswerOptionToEdit,
  QuestionWithAnswerOptionsToEdit,
  QuestionWithExtendedAnswerToEdit,
  TestToEdit,
} from "@/models/test/to-edit";
import { APIError, APIErrorCode } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { TestService } from "@/services/test-service";
import { extractData } from "@/services/helpers";

enum Mode {
  CREATION = "CREATION",
  EDITING = "EDITING",
}

export default defineComponent({
  components: {
    EditableQuestionBlock,
  },

  data() {
    return {
      test: new TestToEdit(),
      notificationStore: useNotificationStore(),
      mode: Mode.CREATION,
    };
  },

  created() {
    if (this.$route.path !== "/create-test") {
      this.mode = Mode.EDITING;
    }
  },

  async mounted() {
    if (this.mode === Mode.EDITING) {
      await this.loadTest();
    }
  },

  computed: {
    creationMode() {
      return Mode.CREATION;
    },

    editingMode() {
      return Mode.EDITING;
    },
  },

  methods: {
    async create() {
      const start = Date.now();
      const result = extractData(await TestService.create(this.test));
      const end = Date.now();
      console.log(`Test creation took ${end - start} ms.`);

      if (result instanceof Report) {
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
      } else if (result instanceof APIError) {
        this.notificationStore.add(
          new Notification(Status.FAILURE, result.message)
        );
        if (result.code !== APIErrorCode.ERR_NETWORK) {
          this.$router.push("/");
        }
      }
    },

    async loadTest() {
      const result = extractData(
        await TestService.getTestToEdit(Number(this.$route.params["id"]))
      );

      if (result instanceof Report) {
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
        if (result.payload) {
          const test = result.payload;
          this.test = new TestToEdit(
            test.title,
            test.questions.map((question) => {
              switch (question.type) {
                case QuestionType.EXTENDED:
                  return new QuestionWithExtendedAnswerToEdit(
                    question.content,
                    question.worth,
                    (
                      question as QuestionWithExtendedAnswerToEdit
                    ).correctAnswer,
                    question.id
                  );
                case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
                case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
                  return new QuestionWithAnswerOptionsToEdit(
                    question.type,
                    question.content,
                    question.worth,
                    (
                      question as QuestionWithAnswerOptionsToEdit
                    ).answerOptions.map(
                      (answerOption) =>
                        new AnswerOptionToEdit(
                          answerOption.content,
                          answerOption.isCorrect,
                          answerOption.id
                        )
                    ),
                    question.id
                  );
                default:
                  throw new Error(
                    `Wrong question type '${question.type}' detected while uploading a test to edit.`
                  );
              }
            }),
            test.id
          );
        }
      } else {
        this.notificationStore.add(
          new Notification(Status.FAILURE, result.message)
        );
      }
    },

    async update() {
      const start = Date.now();
      const result = extractData(await TestService.update(this.test));
      const end = Date.now();
      console.log(`Saving the edited test took ${end - start} ms.`);

      if (result instanceof Report) {
        if (result.payload) {
          const test = result.payload;
          this.test = new TestToEdit(
            test.title,
            test.questions.map((question) => {
              switch (question.type) {
                case QuestionType.EXTENDED:
                  return new QuestionWithExtendedAnswerToEdit(
                    question.content,
                    question.worth,
                    (
                      question as QuestionWithExtendedAnswerToEdit
                    ).correctAnswer,
                    question.id
                  );
                case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
                case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
                  return new QuestionWithAnswerOptionsToEdit(
                    question.type,
                    question.content,
                    question.worth,
                    (
                      question as QuestionWithAnswerOptionsToEdit
                    ).answerOptions.map(
                      (answerOption) =>
                        new AnswerOptionToEdit(
                          answerOption.content,
                          answerOption.isCorrect,
                          answerOption.id
                        )
                    ),
                    question.id
                  );
                default:
                  throw new Error(
                    `Wrong question type '${question.type}' detected while uploading a test to edit.`
                  );
              }
            }),
            test.id
          );
        }

        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
      } else if (result instanceof APIError) {
        this.notificationStore.add(
          new Notification(Status.FAILURE, result.message)
        );
        if (result.code !== APIErrorCode.ERR_NETWORK) {
          this.$router.push("/");
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.test {
  border: 4px solid #1e434c;
  border-radius: 5px;
  margin: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 20px;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  > .title {
    display: flex;
    flex-direction: column;

    > label {
      color: #070f11;
      font-size: 1.5rem;
    }

    > input {
      font-size: 1.5rem;
    }
  }
}
</style>
