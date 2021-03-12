// import React from 'react';
import { docSiteUrl } from '../utils/Baseurl';
import { handleDateFormat } from '../utils/DateMethod';
import { handleTimeFormat } from '../utils/DateMethod';

export const ReScheduleAppointmentMailToDoctor = (location, currentDate, currentTime, newDate, newTime, name, docId, patientId) => {
  return ` <div
    class="email_summary"
    style="display: none;font-size: 1px;line-height: 1px;max-height: 0px;max-width: 0px;opacity: 0;overflow: hidden;"
  >
    Email summary
  </div>
  <div
    class="email_summary"
    style="display: none;font-size: 1px;line-height: 1px;max-height: 0px;max-width: 0px;opacity: 0;overflow: hidden;"
  >
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
  <!-- notification_default -->
  <table
    class="email_section"
    role="presentation"
    align="center"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
  >
    <tbody>
      <tr>
        <td
          class="email_bg bg_light px py_lg"
          style="font-size: 0;text-align: center;line-height: 100%;background-color: #d1deec;padding-top: 64px;padding-bottom: 64px;padding-left: 16px;padding-right: 16px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
        >
          <table
            class="content_section"
            role="presentation"
            align="center"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="max-width: 800px;margin: 0 auto;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
          >
            <tbody>
              <tr>
                <td
                  class="content_cell bg_white brounded bt_primary px py_md"
                  style="font-size: 0;text-align: center;background-color: #ffffff;border-top: 4px solid #47b475;border-radius: 4px;padding-top: 32px;padding-bottom: 32px;padding-left: 16px;padding-right: 16px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                >
                  <div
                    class="column_row"
                    style="font-size: 0;text-align: center;max-width: 624px;margin: 0 auto;"
                  >
                    <div
                      class="col_1"
                      style="vertical-align: top;display: inline-block;width: 100%;max-width: 208px;"
                    >
                      <table
                        class="column"
                        role="presentation"
                        align="center"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="vertical-align: top;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column_cell px py_xs text_primary text_left mobile_center"
                              style="vertical-align: top;color: #2376dc;text-align: left;padding-top: 8px;padding-bottom: 8px;padding-left: 16px;padding-right: 16px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                            >
                              <p
                                class="img_inline"
                                style="color: inherit;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;font-size: 16px;line-height: 100%;clear: both;"
                              >
                                <a
                                  href="#"
                                  style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #2376dc;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;"
                                  ><img
                                    src="https://smartappt.com/smartappt-logo.png"
                                    width="150"
                                    height=""
                                    alt="Smart Appointment"
                                    style="max-width: 150px;-ms-interpolation-mode: bicubic;border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;"
                                /></a>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div
                      class="col_3"
                      style="vertical-align: top;display: inline-block;width: 100%;max-width: 416px;"
                    ></div>
                  </div>
                  <div
                    class="column_row"
                    style="font-size: 0;text-align: center;max-width: 624px;margin: 0 auto;"
                  >
                    <div
                      class="col_3"
                      style="vertical-align: top;display: inline-block;width: 100%;max-width: 416px;"
                    >
                      <table
                        class="column"
                        role="presentation"
                        align="center"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="vertical-align: top;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column_cell bb_light"
                              height="32"
                              style="vertical-align: top;border-bottom: 1px solid #dee0e1;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                            >
                              &nbsp;
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    class="column_row"
                    style="font-size: 0;text-align: center;max-width: 624px;margin: 0 auto;"
                  >
                    <table
                      class="column"
                      role="presentation"
                      align="center"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="vertical-align: top;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column_cell px py_md text_dark text_center"
                            style="vertical-align: top;color: #333333;text-align: center;padding-top: 32px;padding-bottom: 32px;padding-left: 16px;padding-right: 16px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                          >
                            <h2
                              class="mt_md mb_xs"
                              style="color: inherit;font-family: Arial, Helvetica, sans-serif;margin-top: 32px;margin-bottom: 8px;word-break: break-word;font-size: 28px;line-height: 38px;font-weight: bold; padding-bottom:20px;"
                            >
                              Your Appointment has been Re-Scheduled By <b>${name}
                            </h2>

                            <tr>
                                <td>
                                <p
                                    style="color: #333;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                                  >
                                    Previous Appointment
                                  </p>

                                <p
                                style="color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                              >
                                Date: ${handleDateFormat(currentDate)}
                              </p>
                              <p
                                style="color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                              >
                                Time: ${handleTimeFormat(currentTime)}
                              </p>
                              <p
                                style="color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                              >
                                Location: ${location}
                              </p>
                                </td>
                            </tr>


                            <tr>
                                <td>
                                <p
                                    style="color: #333;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                                  >
                                    New Appointment
                                  </p>

                                <p
                                style="color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                              >
                                Date: ${handleDateFormat(newDate)}
                              </p>
                              <p
                                style="color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                              >
                                Time: ${handleTimeFormat(newTime)}
                              </p>
                              <p
                                style="color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 19px;line-height: 31px;"
                              >
                                Location: ${location}
                              </p>
                                </td>
                            </tr>

                            <table
                              role="presentation"
                              class="ebutton"
                              align="center"
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;margin: 0 auto;"
                            >
                              <tbody>
                                <tr>
                                <div
                                style="height:auto;width:100%;padding:5px;"
                              >
                                <ul>
                                  <li
                                    style="margin:3px; list-style:none;float: left;background-color: #47b475;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 5pt;mso-table-rspace: 0pt;font-size: 16px;padding: 13px 40px;border-radius: 4px;line-height: normal;text-align: center;font-weight: bold;-webkit-transition: box-shadow .25s;transition: box-shadow .25s;"
                                  >
                                    <a
                                      href='${docSiteUrl}/confirm?date=${newTime}&time=${newTime}&docId=${docId}&id=${patientId}&status=0'
                                      style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #ffffff;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;font-weight: bold;"
                                      ><span
                                        style="color: #ffffff;text-decoration: none;"
                                        >Confirm</span
                                      ></a
                                    >
                                  </li>

                                  <li
                                    style="margin:3px; list-style:none;float: left;background-color: #47b475;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 5pt;mso-table-rspace: 0pt;font-size: 16px;padding: 13px 40px;border-radius: 4px;line-height: normal;text-align: center;font-weight: bold;-webkit-transition: box-shadow .25s;transition: box-shadow .25s;"
                                  >
                                    <a
                                      href='${docSiteUrl}/confirm?date=${newDate}&time=${newTime}&docId=${docId}&id=${patientId}&status=2'
                                      style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #ffffff;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;font-weight: bold;"
                                      ><span
                                        style="color: #ffffff;text-decoration: none;"
                                        >Cancel</span
                                      ></a
                                    >
                                  </li>
                                  <li
                                    style="margin:3px; list-style:none;float: left;background-color: #47b475;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 5pt;mso-table-rspace: 0pt;font-size: 16px;padding: 13px 40px;border-radius: 4px;line-height: normal;text-align: center;font-weight: bold;-webkit-transition: box-shadow .25s;transition: box-shadow .25s;"
                                  >
                                    <a
                                      href='${docSiteUrl}/confirm?date=${newDate}&time=${newTime}&docId=${docId}&id=${patientId}&status=1'
                                      style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #ffffff;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;font-weight: bold;"
                                      ><span
                                        style="color: #ffffff;text-decoration: none;"
                                        >Re-Schedule</span
                                      ></a
                                    >
                                  </li>
                                </ul>
                              </div>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  class="content_cell"
                  style="font-size: 0;text-align: center;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                >
                  <div
                    class="column_row"
                    style="font-size: 0;text-align: center;max-width: 624px;margin: 0 auto;"
                  >
                    <table
                      class="column"
                      role="presentation"
                      align="center"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="vertical-align: top;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column_cell px py_md text_secondary text_center"
                            style="vertical-align: top;color: #959ba0;text-align: center;padding-top: 32px;padding-bottom: 32px;padding-left: 16px;padding-right: 16px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                          >
                            <p
                              class="img_inline mb"
                              style="color: inherit;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 16px;word-break: break-word;font-size: 16px;line-height: 100%;clear: both;"
                            >
                              <a
                                href="#"
                                style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;"
                                ><img
                                  src="https://cliffex.com/stage/email-templates/images/facebook.png"
                                  width="24"
                                  height="24"
                                  alt="Facebook"
                                  style="max-width: 24px;-ms-interpolation-mode: bicubic;border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;"
                              /></a>
                              &nbsp;&nbsp;
                              <a
                                href="#"
                                style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;"
                                ><img
                                  src="https://cliffex.com/stage/email-templates/images/twitter.png"
                                  width="24"
                                  height="24"
                                  alt="Twitter"
                                  style="max-width: 24px;-ms-interpolation-mode: bicubic;border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;"
                              /></a>
                              &nbsp;&nbsp;
                              <a
                                href="#"
                                style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;"
                                ><img
                                  src="https://cliffex.com/stage/email-templates/images/instagram.png"
                                  width="24"
                                  height="24"
                                  alt="Instagram"
                                  style="max-width: 24px;-ms-interpolation-mode: bicubic;border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;"
                              /></a>
                              &nbsp;&nbsp;
                              <a
                                href="#"
                                style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;text-decoration: none;color: #959ba0;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 0px;word-break: break-word;"
                                ><img
                                  src="https://cliffex.com/stage/email-templates/images/pinterest.png"
                                  width="24"
                                  height="24"
                                  alt="Pinterest"
                                  style="max-width: 24px;-ms-interpolation-mode: bicubic;border: 0;height: auto;line-height: 100%;outline: none;text-decoration: none;"
                              /></a>
                            </p>
                            <p
                              class="mb_xs"
                              style="color: inherit;font-family: Arial, Helvetica, sans-serif;margin-top: 0px;margin-bottom: 8px;word-break: break-word;font-size: 16px;line-height: 26px;"
                            >
                              &copy;2019 Smart Appointment.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`
}
