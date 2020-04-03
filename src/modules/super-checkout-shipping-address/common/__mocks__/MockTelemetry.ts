import { ITelemetry } from '@msdyn365-commerce/core';

/**
 *
 * MockTelemetry class
 * @implements {ITelemetry}
 */
class MockTelemetry implements ITelemetry {
    // tslint:disable-next-line:no-empty
    public log(): void { }

    // tslint:disable-next-line:no-empty
    public trace(): void { }

    // tslint:disable-next-line:no-empty
    public debug(): void { }

    // tslint:disable-next-line:no-empty
    public warning(): void { }

    // tslint:disable-next-line:no-empty
    public critical(): void { }

    // tslint:disable-next-line:no-empty
    public exception(): void { }

    // tslint:disable-next-line:no-empty
    public logEvent(): void { }

    // tslint:disable-next-line:no-empty
    public trackMetric(): void { }

    // tslint:disable-next-line:no-empty
    public trackEvent(): void { }

    // tslint:disable-next-line:no-empty
    public setTelemetryRequestContext(): void { }

    public setTelemetryModuleContext(): () => ITelemetry {
        return () => this;
    }

    // tslint:disable-next-line:no-empty
    public trackDependency(): void {}

    // tslint:disable-next-line:no-empty
    public information(): void { }

    // tslint:disable-next-line:no-empty
    public error(): void { }
}

export default MockTelemetry;
